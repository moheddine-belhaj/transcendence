# transcendence
42 transcendence

### Backend

```sh
npm install --legacy-peer-deps
```

create .env

```sh
touch .env
```

```text
DATABASE_URL="file:./dev.db"
```

```sh
npm run dev

```

```sh
npm run dev

```

- server run - http://localhost:3000


or with docker

```sh
docker-compose up
```

Create fresh migration
```sh
- npx prisma migrate dev --name init
```

- Delete Database

```sh
rm -r prisma/migrations/ && rm prisma/dev.db
```


### frontend


```sh
npm install
```


```sh
npm run dev
```

- http://localhost:5173


