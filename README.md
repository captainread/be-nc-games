# NC Games API

## Project summary

- This project mimics the structure of a real-world backend service which provides information to frontend architecture.

- The underlying database (themed around board game reviews) is made using **PSQL** and interacted with via **node-postgres**.

---------------

## Requirements
Minimum versions of `Node.js` and `Postgres` needed to run the project:
- **node.js**: v18.10.0
- **Postgres**: v14.5

---------------

## Local instructions
In order to run this project locally, please follow the instructions below.

1. Clone the repository from github

```shell
$ git clone https://github.com/captainread/nc-games.git
```

2. Navigate to / open the repo.

3. For development, install required packages by running:
```shell
$ npm install
```

4. Create the necessary environment variable files. In the main directory, create files named:
```
.env.development
.env.test
```

5. Add these lines to the files:
```js
// .env.development
PGDATABASE=nc_games

// .env.test
PGDATABASE=nc_games_test
```

6. Seed the database by running these commands:
```shell
 $ npm run setup-dbs
 $ npm run seed
 ```

 7. Run tests via Jest with the following command:
```shell
$ npm test
```