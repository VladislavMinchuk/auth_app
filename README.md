## Description
Auth API application base on NestJS framework.
Simple authentication - email, password.

## Technology stack
This project built using Node v18.x and uses the following technologies:
- PostgreSQL ([typeORM](https://www.npmjs.com/package/typeorm))
- Redis
- Docker

## Quick dev run

```bash
git clone https://github.com/VladislavMinchuk/auth_app.git
cp env-example .dev.env
docker compose up -d
```
```bash
npm install
```

## Running the app

```bash
# watch development mode
npm run start:dev

# production mode
npm run start:prod
```
Server started on port 3000 (port by default)

## Check API
```bash
POST /auth/register

Request body:
{
  "email": "email@gmail.com",
  "password": "password",
  "name": "Andy"
}

Response body:
{
  "id": 16,
  "name": "Andy",
  "email": "email@gmail.com"
}
```

```bash
POST /auth/login

Request body:
{
  "email": "email@gmail.com",
  "password": "password"
}

Response body:
{
  "id": 16,
  "name": "Andy",
  "email": "email@gmail.com"
}
```
After authorization, Authentication and Refresh cookies (HttpOnly) will be sent to the client.


```bash
# To update Authentication and Refresh cookies
POST /auth/refresh
# Authentication and Refresh cookies are mandatory !

Response body:
# User ID
{
  "id": 16
}
```

```bash
POST /auth/logout
# Authentication and Refresh cookies are mandatory !

Response body:
'OK'
```
 ### Protected route
```bash
GET /users/:id

Response body:
{
  "id": 16,
  "name": "Andy",
  "email": "email@gmail.com"
}
```
