# compostage-dans-ma-ville Backend

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).


## Set up local database

```
docker run --name MY_DOCKER_INSTANCE_NAME -p 5432:5432  -e POSTGRES_PASSWORD=MY_PWD  -e POSTGRES_USER=MY_USER  -e POSTGRES_DB=MY_DB_NAME -v my-postgres-db-db:/var/lib/postgresql/data -d postgres:15
```

## Start local smtp server

Run the docker image:

```bash
docker run --name STRAPI_SMTP_PROVIDER -p 3000:80 -p 2525:25 rnwood/smtp4dev
```

The TCP port is `2525` and you can open the app at http://localhost:3000.
