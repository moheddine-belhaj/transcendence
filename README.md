# transcendence
42 transcendence

## Backend

### FIRST THING TO DO

- Use this command to install any dependencies

```sh
npm install --legacy-peer-deps
```
- create .env

```sh
touch .env
```

```
DATABASE_URL="file:./dev.db"

// Send verification email variable
EMAIL_SERVICE=gmail # or your email provider
EMAIL_USER= # Your full email address
EMAIL_PASSWORD= # Not your regular password! ASK MOHEDDINE
EMAIL_FROM="Your App Name <Transcendence <noreply@transcendence.com>>"
BASE_URL=http://localhost: # frontend
```

### To set up Email Verification:

1. Go to [Google Account Security](https://myaccount.google.com/)  
   - Sign in if needed
   - Navigate to "Security" tab

2. Enable **2-Step Verification**  
   - Under "Signing in to Google", click "2-Step Verification"  
   - Follow the prompts to set it up

3. Create an **App Password**  
   - After enabling 2FA, search for "App Passwords" in the security page  
   - Enter your app name (e.g., "Transendence")  
   - Click "Generate"  

4. Copy the generated 16-character password  
   - Use this as your `EMAIL_PASSWORD` in `.env`  
   - Example:  
  ```
  GMAIL_USER=your.email@gmail.com
  GMAIL_PASSWORD=your-generated-app-password
  ```
</br>

- Start the server

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

### User Management
- Create user [POST] 

```
http://localhost:3000/api/users/
```
```
{
  "email": "m@m.com",
  "name": "User 21",
  "password": "password"
}

```

- Verify Email [GET]
```
http://localhost:3000/api/users/verify-email?token=
```

- Get all Users [GET]

```
http://localhost:3000/api/users
```

- Login user [POST]
```
http://localhost:3000/api/users/login
```
```
{
  "email": "m@m.com",
  "password": "password"
}
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

### Friends management

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

### Match Management

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


### GAME

```sh
docker system prune -a
docker builder prune -a
docker-compose build --no-cache
docker-compose up

```