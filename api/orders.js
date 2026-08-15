const { query, sendError, withTransaction } = require("./_db");

const statusMap = {
  CARRINHO: "Pedido recebido",
  CRIADO: "Pedido recebido",
  CONFIRMADO: "Pedido recebido",
  EM_PREPARO: "Em preparo",
  PRONTO: "Em preparo",
  SAIU_PARA_ENTREGA: "Saiu para entrega",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

function orderCode(id) {
  return `PED-${String(id).padStart(4, "0")}`;
}

function parseOrderCode(code = "") {
  const match = String(code).match(/\d+/);
  return match ? Number(match[0]) : null;
}

function addressParts(address = "") {
  return {
    logradouro: address.trim() || "Retirada na loja Amor Cafe e Flor",
    numero: "S/N",
    complemento: null,
    bairro: "Centro",
    cidade: "Curitiba",
    estado: "PR",
    cep: "00000-000",
  };
}

async function trackOrder(request, response) {
  const id = parseOrderCode(request.query.code || request.query.tracking);

  if (!id) {
    response.status(400).json({ error: "Informe o numero do pedido" });
    return;
  }

  const result = await query(`
    SELECT
      p.id_pedido,
      p.status,
      p.valor_total,
      p.data_criacao,
      COALESCE(pg.metodo, 'PIX') AS metodo_pagamento,
      COALESCE(
        json_agg(
          json_build_object(
            'name', pr.nome,
            'qty', ip.quantidade,
            'price', ip.preco_unitario
          )
        ) FILTER (WHERE ip.id_item_pedido IS NOT NULL),
        '[]'
      ) AS items
    FROM pedido p
    LEFT JOIN pagamento pg ON pg.id_pedido = p.id_pedido
    LEFT JOIN item_pedido ip ON ip.id_pedido = p.id_pedido
    LEFT JOIN variacao_produto vp ON vp.id_variacao = ip.id_variacao
    LEFT JOIN produto pr ON pr.id_produto = vp.id_produto
    WHERE p.id_pedido = $1
    GROUP BY p.id_pedido, pg.metodo
    LIMIT 1
  `, [id]);

  if (!result.rows.length) {
    response.status(404).json({ error: "Pedido nao encontrado" });
    return;
  }

  const order = result.rows[0];
  response.status(200).json({
    id: orderCode(order.id_pedido),
    tracking: orderCode(order.id_pedido),
    status: statusMap[order.status] || order.status,
    value: Number(order.valor_total),
    payment: order.metodo_pagamento === "CARTAO" ? "Cartao" : order.metodo_pagamento,
    date: new Date(order.data_criacao).toLocaleString("pt-BR"),
    items: order.items,
  });
}

async function createOrder(request, response) {
  const payload = request.body || {};
  const buyer = payload.buyer || {};
  const delivery = payload.delivery || {};
  const payment = payload.payment || "PIX";
  const items = Array.isArray(payload.items) ? payload.items : [];

  if (!buyer.name || !buyer.email || !buyer.phone || !items.length) {
    response.status(400).json({ error: "Dados do comprador e itens sao obrigatorios" });
    return;
  }

  const created = await withTransaction(async (client) => {
    const cliente = await client.query(`
      INSERT INTO cliente (nome, email, telefone)
      VALUES ($1, $2, $3)
      ON CONFLICT (email)
      DO UPDATE SET nome = EXCLUDED.nome, telefone = EXCLUDED.telefone
      RETURNING id_cliente
    `, [buyer.name, buyer.email, buyer.phone]);

    const variationIds = items.map((item) => Number(item.productId)).filter(Boolean);
    const variations = await client.query(`
      SELECT id_variacao, preco
      FROM variacao_produto
      WHERE id_variacao = ANY($1::int[])
        AND ativo = TRUE
        AND disponivel = TRUE
    `, [variationIds]);

    const priceById = new Map(variations.rows.map((row) => [Number(row.id_variacao), Number(row.preco)]));
    const subtotal = items.reduce((total, item) => {
      const price = priceById.get(Number(item.productId));
      if (!price) return total;
      return total + price * Number(item.qty || 1);
    }, 0);

    if (subtotal <= 0) {
      throw new Error("Nenhum item do carrinho foi encontrado no banco");
    }

    const freight = delivery.type === "Retirada na loja" ? 0 : Number(payload.deliveryFee || 18);
    const total = subtotal + freight;
    const address = addressParts(delivery.address);

    const pedido = await client.query(`
      INSERT INTO pedido (
        id_cliente,
        status,
        logradouro_entrega,
        numero_entrega,
        complemento_entrega,
        bairro_entrega,
        cidade_entrega,
        estado_entrega,
        cep_entrega,
        subtotal,
        valor_total
      )
      VALUES ($1, 'CRIADO', $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id_pedido
    `, [
      cliente.rows[0].id_cliente,
      address.logradouro,
      address.numero,
      address.complemento,
      address.bairro,
      address.cidade,
      address.estado,
      address.cep,
      subtotal,
      total,
    ]);

    for (const item of items) {
      const id = Number(item.productId);
      const price = priceById.get(id);
      if (!price) continue;

      const qty = Number(item.qty || 1);
      await client.query(`
        INSERT INTO item_pedido (id_pedido, id_variacao, quantidade, preco_unitario, subtotal)
        VALUES ($1, $2, $3, $4, $5)
      `, [pedido.rows[0].id_pedido, id, qty, price, price * qty]);
    }

    await client.query(`
      INSERT INTO pagamento (id_pedido, metodo, status, valor)
      VALUES ($1, $2, 'PENDENTE', $3)
    `, [pedido.rows[0].id_pedido, payment === "Cartao" || payment === "Cartão" ? "CARTAO" : "PIX", total]);

    return {
      id: pedido.rows[0].id_pedido,
      total,
    };
  });

  response.status(201).json({
    id: orderCode(created.id),
    tracking: orderCode(created.id),
    status: "Pedido recebido",
    value: created.total,
  });
}

module.exports = async function ordersHandler(request, response) {
  try {
    if (request.method === "GET") {
      await trackOrder(request, response);
      return;
    }

    if (request.method === "POST") {
      await createOrder(request, response);
      return;
    }

    response.setHeader("Allow", "GET, POST");
    response.status(405).json({ error: "Metodo nao permitido" });
  } catch (error) {
    sendError(response, error);
  }
};
