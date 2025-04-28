# transcendence
42 transcendence



# BACKEND


* dependencies

```ssh
npm install @prisma/client fastify@latest @fastify/swagger@latest zod fastify-zod zod-to-json-schema fastify-jwt
```

* Database init with migration

```ssh
npx prisma init
```
_
```ssh
npx prisma migrate dev --name init
```