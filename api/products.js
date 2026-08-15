const { query, sendError } = require("./_db");

const fallbackImage = "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=85";

module.exports = async function productsHandler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Metodo nao permitido" });
    return;
  }

  try {
    const result = await query(`
      SELECT
        vp.id_variacao,
        p.id_produto,
        p.nome AS produto_nome,
        p.descricao AS produto_descricao,
        p.imagem_url,
        vp.nome AS variacao_nome,
        vp.descricao AS variacao_descricao,
        vp.preco,
        vp.disponivel,
        c.nome AS categoria_nome
      FROM variacao_produto vp
      INNER JOIN produto p ON p.id_produto = vp.id_produto
      INNER JOIN categoria c ON c.id_categoria = p.id_categoria
      WHERE p.ativo = TRUE
        AND vp.ativo = TRUE
        AND c.ativo = TRUE
      ORDER BY c.nome, p.nome, vp.nome
    `);

    const products = result.rows.map((row) => {
      const variation = row.variacao_nome && !["padrao", "padrão", "unico", "único"].includes(row.variacao_nome.toLowerCase())
        ? ` ${row.variacao_nome}`
        : "";

      return {
        id: Number(row.id_variacao),
        dbProductId: Number(row.id_produto),
        name: `${row.produto_nome}${variation}`,
        price: Number(row.preco),
        category: row.categoria_nome,
        occasion: "Especial",
        rating: 4.9,
        image: row.imagem_url || fallbackImage,
        description: row.variacao_descricao || row.produto_descricao || "Produto especial da Amor Cafe e Flor.",
        available: row.disponivel,
        source: "database",
      };
    });

    response.status(200).json({ products });
  } catch (error) {
    sendError(response, error);
  }
};
