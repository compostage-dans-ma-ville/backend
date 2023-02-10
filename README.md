# compostage-dans-ma-ville Backend

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

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


## Set up local database

* Replace the values in the .env as expected
* 
```
docker run --name MY_DOCKER_INSTANCE_NAME -p 5432:5432  -e POSTGRES_PASSWORD=MY_PWD  -e POSTGRES_USER=MY_USER  -e POSTGRES_DB=MY_DB_NAME -v my-postgres-db-db:/var/lib/postgresql/data -d postgres:15
```

## Start local smtp server

Run the docker image:

```bash
docker run --name STRAPI_SMTP_PROVIDER -p 3000:80 -p 2525:25 rnwood/smtp4dev
```

The TCP port is `2525` and you can open the app at http://localhost:3000.
