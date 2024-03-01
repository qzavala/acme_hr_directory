const express = require('express');
const pg = require('pg');
const path = require('path');


// app.use(express.json());
// app.use(require('morgan')('dev'));

const client = new pg.Client(
    process.env.DATABASE_URL || 'postgres://localhost/hr_directory_db'
)

const app = express();
app.use(express.json());
app.use(require("morgan")("dev"));

app.get("/"), (req, res, next) =>
res.sendFile(path.join(__dirname, 'index.html'));

app.get("/api/employees", async (req, res, next) => {
    try {
  
      const SQL = `SELECT * FROM employees`;
      const response = await client.query(SQL);
      res.send(response.rows);
    } catch (ex) {
      next(ex);
    }
  });








async function init() {
    client.connect();

const SQL = `
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;

CREATE TABLE employees(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT now(),
    created_at TIMESTAMP DEFAULT now(),
    department_id INTEGER REFERENCES categories(id) NOT NULL

);

CREATE TABLE departments(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL

);

INSERT INTO employees(name, department_id) VALUES('Tom', 'Sales Lead');
INSERT INTO employees(name, department_id) VALUES('Timmy', 'Head Custodian' );
INSERT INTO employees(name, department_id) VALUES('Tamantha', 'IT Support Manager ');


INSERT INTO departments(name) VALUES('Sales'), (SELECT name FROM employees WHERE department_id = 'Sales Lead');

INSERT INTO departments(name) VALUES('Janitor'),(SELECT name FROM employees WHERE department_id = 'Head Custodian');

INSERT INTO departments(name) VALUES('IT Support'),(SELECT name FROM employees WHERE department_id = 'IT Support Manager');


`;

await client.query(SQL);
console.log("database has been seeded");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening in port ${PORT}`));
};

init();

