# Compostage dans ma ville - Backend

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
yarn
```

### Set up the local database

1. `cp .env.example .env`
2. `yarn db:start`

#### Local seeding

```bash
yarn db:seed
```
or reset the data with:
```bash
yarn db:seed:refresh
```

### Set up .env
Copy .env.example content into a .env file and modify it whith your settings

Generate a secret for the JWT_SECRET_KEY field in .env
You can use this site for example :
https://www.grc.com/passwords.htm

### Set up a local docker compose

Put this in a .env.docker:
```
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=compostage_dev
DATABASE_URL="postgresql://admin:admin@db:5432/compostage_dev"
```
and `docker-compose up` !

## DB Schema

A graphical representation of the schema can be obtained by running a `prisma generate`. It generates a `~/prisma/dbml/schema.dbml`.
Paste the content in https://dbdiagram.io/d.

## License

Nest is [MIT licensed](LICENSE).
