-- Dados iniciais para a loja Amor Cafe e Flor.
-- Execute este arquivo depois de executar schema_ifood_bd_1.sql.

INSERT INTO restaurante (
  razao_social,
  nome_fantasia,
  cnpj,
  telefone,
  logradouro,
  numero,
  complemento,
  bairro,
  cidade,
  estado,
  cep,
  latitude,
  longitude
)
VALUES (
  'Amor Cafe e Flor LTDA',
  'Amor Cafe e Flor',
  '00.000.000/0001-00',
  '(41) 99999-1234',
  'Rua das Flores',
  '120',
  NULL,
  'Centro',
  'Curitiba',
  'PR',
  '80000-000',
  -25.4284,
  -49.2733
)
ON CONFLICT (cnpj) DO UPDATE
SET
  nome_fantasia = EXCLUDED.nome_fantasia,
  telefone = EXCLUDED.telefone;

INSERT INTO categoria (id_restaurante, nome, descricao)
SELECT r.id_restaurante, c.nome, c.descricao
FROM restaurante r
CROSS JOIN (
  VALUES
    ('Buques', 'Buques delicados para presentear.'),
    ('Arranjos', 'Arranjos florais premium.'),
    ('Cestas', 'Cestas especiais e personalizadas.'),
    ('Cafe', 'Cestas e presentes de cafe da manha.'),
    ('Presentes', 'Presentes completos e personalizados.'),
    ('Chocolates', 'Chocolates e mimos doces.')
) AS c(nome, descricao)
WHERE r.cnpj = '00.000.000/0001-00'
  AND NOT EXISTS (
    SELECT 1
    FROM categoria existente
    WHERE existente.id_restaurante = r.id_restaurante
      AND existente.nome = c.nome
  );

INSERT INTO produto (id_categoria, nome, descricao, imagem_url)
SELECT c.id_categoria, p.nome, p.descricao, p.imagem_url
FROM categoria c
JOIN restaurante r ON r.id_restaurante = c.id_restaurante
JOIN (
  VALUES
    ('Buques', 'Buque Encanto', 'Rosas em tons suaves, folhagens delicadas e acabamento premium em papel texturizado.', 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=85'),
    ('Cafe', 'Cesta Cafe Romantico', 'Cafe especial, paes artesanais, geleias, frutas e flores para uma manha memoravel.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=85'),
    ('Arranjos', 'Arranjo Rosa Vintage', 'Arranjo em vaso claro com flores rosadas, perfeito para decorar e presentear.', 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=85'),
    ('Presentes', 'Presente Completo Amor', 'Flores, chocolate, cartao personalizado e mimo especial em uma composicao elegante.', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=85'),
    ('Cestas', 'Cesta Doce Manha', 'Cesta acolhedora com doces finos, bolinhos, cafe e detalhes florais.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=85'),
    ('Buques', 'Buque Primavera', 'Mix colorido e sofisticado com flores da estacao para celebrar conquistas.', 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=85'),
    ('Chocolates', 'Box Chocolates e Flores', 'Caixa presenteavel com bombons selecionados e mini arranjo floral.', 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=800&q=85')
) AS p(categoria, nome, descricao, imagem_url)
  ON p.categoria = c.nome
WHERE r.cnpj = '00.000.000/0001-00'
  AND NOT EXISTS (
    SELECT 1
    FROM produto existente
    WHERE existente.id_categoria = c.id_categoria
      AND existente.nome = p.nome
  );

INSERT INTO variacao_produto (id_produto, nome, descricao, preco, disponivel)
SELECT p.id_produto, 'Padrao', p.descricao, v.preco, TRUE
FROM produto p
JOIN categoria c ON c.id_categoria = p.id_categoria
JOIN restaurante r ON r.id_restaurante = c.id_restaurante
JOIN (
  VALUES
    ('Buque Encanto', 189.90),
    ('Cesta Cafe Romantico', 249.90),
    ('Arranjo Rosa Vintage', 159.90),
    ('Presente Completo Amor', 329.90),
    ('Cesta Doce Manha', 219.90),
    ('Buque Primavera', 179.90),
    ('Box Chocolates e Flores', 199.90)
) AS v(nome, preco)
  ON v.nome = p.nome
WHERE r.cnpj = '00.000.000/0001-00'
  AND NOT EXISTS (
    SELECT 1
    FROM variacao_produto existente
    WHERE existente.id_produto = p.id_produto
      AND existente.nome = 'Padrao'
  );
