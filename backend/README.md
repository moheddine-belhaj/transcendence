# transcendence
42 transcendence

## Backend

### FIRST THING TO DO

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

- server run - http://localhost:3000


or with docker

```sh
docker-compose up
```

Create fresh migration
```sh
 npx prisma migrate dev --name init
```

- Delete Database

```sh
rm -r prisma/migrations/ && rm prisma/dev.db
```
## ENDPOINTS

#### User Management
- Create user [POST] 

```
http://localhost:3000/api/users/
```

- Get all Users [GET]

```
http://localhost:3000/api/users
```

- Login user [POST]
```
http://localhost:3000/api/users/login
```

- Update User [PUT]

```
http://localhost:3000/api/users/update/1
```
```
{
  "name": "New Name",
  "email": "new@email.com",
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

#### Friends management

- Add friend [POST]

```
 http://localhost:3000/api/users/friends 
```

```
{
  "userId": 1, // user id
  "friendId": 2 // Id of the friend you want to add
}

```
- Get all friend [GET]

```
http://localhost:3000/api/users/friends/list/user
```

- Accept friend invitation [PATCH]

```
http://localhost:3000/api/users/friends/accept
```

```
{
  "userId": 2, // user id 
  "friendId": 1 // Id of the friend who send the invitation
}

```

- Refuse invitation [PATCH]

```
http://localhost:3000/api/users/friends/refuse
```

```
{
  "userId": 2, // id of the user who refuse
  "friendId": 1 //  Id of the friend who send the invitation
}
```

- Delete friend [DELETE]

```
http://localhost:3000/api/users/friends
```

```
{
  "userId": 2, // id of the user who refuse
  "friendId": 1 //  Id of the friend who send the invitation
}
```

#### Match Management

- Create Game [POST]

```
http://localhost:3000/api/matches
```

```
{
  "player1Id": 1,
  "player2Id": 2
}
```

- Get all match [GET]

```
http://localhost:3000/api/matches/user/1
```

- Update match stats [PATCH]

```
http://localhost:3000/api/matches/1/result
```

```
{
  "scorePlayer1":100,
  "scorePlayer2": 22,
  "winnerId": 1
}
```

### frontend


```sh
npm install
```


```sh
npm run dev
```

- http://localhost:5173


