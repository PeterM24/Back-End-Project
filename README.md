# 🧩 Peter's House of Games API

An API for a backend server utilising a PSQL Database, populated with games reviews, comments, categories, several endpoints, and more...

**Hosted version:** Head over to [**Peter's House of Games API**](https://house-of-games-0co6.onrender.com/api) to access a range of endpoints for this API. See ***'Using this hosted API'*** further down...

---
## Set up & installation ⚙️

### Clone 

Clone this repo using the following path, in a directory of choice:

```
git clone https://github.com/PeterM24/games.git
```

### Dependencies

Run the following command to install the required dependencies:

```
npm install
```

### Environment variables

You will need to create two .env files in the root directory of the repo, as shown below:

```
.env.test
.env.development
```

Both files should contain the following, in order to access the relevant database:

```
PGDATABASE=<database_name>
```

### Seed

Seed the databases using the following terminal scripts:

```
npm setup-dbs
npm run seed
```

This will populate the .development database. The .test database will setup and seed when running tests, e.g.:

```
npm test app.js
```
---
# Using this hosted API 🔍

```
https://house-of-games-0co6.onrender.com <endpoint>
```
## endpoints:
#### **GET**
- /api
- /api/categories
- /api/reviews
- /api/reviews/:review_id
- /api/reviews/:review_id/comments
- /api/users

#### **PATCH**
- /api/reviews/:review_id

#### **POST**
- /api/reviews/:review_id/comments

#### **DELETE**
- /api/comments/:comment_id