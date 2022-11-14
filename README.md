# NC Games API

## Local instructions
In order to run this project locally, please follow the instructions below.
1. Clone the repository from github: https://github.com/captainread/nc-games

2. Navigate to / open the repo.

3. For development, install required packages by running:
```
npm install
npm install express
npm install supertest --save-dev
```

3. Create the necessary environment variable files. In the main directory, create files named:
```
.env.development
.env.test
```

3. Add these lines to the files:
```js
// .env.development
PGDATABASE=nc_games

// .env.test
PGDATABASE=nc_games_test
```