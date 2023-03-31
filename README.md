# 🧩 Peter's House of Games API

Peter's House of Games API is a backend server that uses a PSQL database to store games reviews, comments, categories, and other information. This API provides several endpoints for retrieving and manipulating data.

## Hosted version

You can access a hosted version of this API by visiting [**Peter's House of Games API**](https://house-of-games-0co6.onrender.com/api). See the section **Using this hosted API** below for more details.

## Set up & installation ⚙️

### Prerequisites
Before getting started with the installation process, you will need to make sure that you have the following minimum versions of Node.js and PostgreSQL installed on your system:

- `Node.js v14.17.0 or later`
- `PostgreSQL v13.0 or later`

### Clone the repository

To get started, clone this repository to a directory of your choice using the following command:

```
git clone https://github.com/PeterM24/games.git
```


### Install dependencies

After cloning the repository, navigate to the root directory of the project and run the following command to install the required dependencies:



```
npm install
```


### Set up environment variables

You will need to create two `.env` files in the root directory of the repository: `.env.test` and `.env.development`. Both files should contain the following line, replacing `<database_name>` with the name of your PostgreSQL database:

```
PGDATABASE=<database_name>
```

### Seed the database

To seed the development database with data, run the following terminal commands in the root directory of the project:

```
npm setup-dbs
npm run seed
```


The `setup-dbs` script creates the necessary databases, while the `seed` script populates the development database with data. The test database is automatically created and seeded when running tests.

## Using this hosted API 🔍

You can access the hosted version of this API by sending requests to the following URL:
``` https://house-of-games-0co6.onrender.com/api ```

The API provides the following endpoints:

#### **GET**

- `/api`
- `/api/categories`
- `/api/reviews`
- `/api/reviews/:review_id`
- `/api/reviews/:review_id/comments`
- `/api/users`

#### **PATCH**

- `/api/reviews/:review_id`

#### **POST**

- `/api/reviews/:review_id/comments`

#### **DELETE**

- `/api/comments/:comment_id`

To use these endpoints, simply append the desired endpoint to the URL above. For example, to retrieve all reviews, send a GET request to:

```
https://house-of-games-0co6.onrender.com/api/reviews
```

For more information on each endpoint and how to use them, please refer to the API endpoints documentation [here](https://house-of-games-0co6.onrender.com/api).
