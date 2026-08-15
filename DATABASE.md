# Conexao com PostgreSQL

O projeto agora possui API para conectar com o banco PostgreSQL do schema `schema_ifood_bd_1.sql`.

## Variaveis de ambiente

Configure no Vercel em `Project Settings > Environment Variables`:

- `DATABASE_URL`: URL completa do PostgreSQL.
- `DATABASE_SSL`: use `true` para bancos hospedados como Neon, Supabase, Railway ou Render. Use `false` apenas em banco local sem SSL.

Exemplo:

```env
DATABASE_URL=postgres://usuario:senha@host:5432/nome_do_banco
DATABASE_SSL=true
```

## Endpoints criados

- `GET /api/products`: busca categorias, produtos e variacoes vendaveis.
- `POST /api/orders`: cria cliente, pedido, itens e pagamento pendente.
- `GET /api/orders?code=PED-0001`: acompanha um pedido pelo numero.

## Observacao

O schema anexado e inspirado em restaurante/iFood. Ele funciona para produtos e pedidos, mas nao tem campos especificos de floricultura como destinatario, mensagem do cartao e data agendada. Esses dados ja estao no frontend, mas para persistir tudo com fidelidade o ideal e criar colunas/tabelas extras depois.
