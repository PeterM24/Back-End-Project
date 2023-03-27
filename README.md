# Northcoders House of Games API

## Set up & installation
```
install npm, supertest, and express
environment variables will be required in order to connect to the test and developer databases.
```
Create two .env files as below:
```
.env.test
.env.development
```
Both files should contain the following, in order to access the relevant database:
```
PGDATABASE=database_name
```

## Husky

To ensure we are not commiting broken code this project makes use of git hooks. Git hooks are scripts triggered during certain events in the git lifecycle. Husky is a popular package which allows us to set up and maintain these scripts. This project makes use a _pre-commit hook_. When we attempt to commit our work, the script defined in the `pre-commit` file will run. If any of our tests fail than the commit will be aborted.

The [Husky documentation](https://typicode.github.io/husky/#/) explains how to configure Husky for your own project as well as creating your own custom hooks.\_
