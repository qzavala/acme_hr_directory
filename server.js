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


app.get("/api/departments", async (req, res, next) => {
    try {
  
      const SQL = `SELECT * FROM departments ORDER BY name`;
      const response = await client.query(SQL);
      res.send(response.rows);
    } catch (ex) {
      next(ex);
    }
  });

  app.post("/api/employees", async (req, res, next) => {
    try {
  
      const SQL = 
      "INSERT INTO employees(name, department_id) VALUES($1, $2) RETURNING *";
      const response = await client.query(SQL, [
        req.body.name,
        req.body.department_id
      ]

      );
      res.send(response.rows[0]);
    } catch (ex) {
      next(ex);
    }
  });

  app.put("/api/employees/:id", async (req, res, next) => {
    try {
  
      const SQL = 
      "UPDATE employees SET name=$1, department_id=$2, updated_at=now() Where id=$3 RETURNING *";
      const response = await client.query(SQL,[
        req.body.name,
        req.body.department_id,
        req.params.id
      ]);
      res.send(response.rows[0]);
    } catch (ex) {
      next(ex);
    }
  });

  

  app.delete("/api/departments/:id", async (req, res, next) => {
    try {
  
      const SQL = "DELETE FROM employees WHERE id=$1";
      await client.query(SQL, [req.params.id]);
      res.send(response.rows);
    } catch (ex) {
      next(ex);
    }
  });




async function init() {
   await client.connect();

let SQL = `
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;

CREATE TABLE departments(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL

);
CREATE TABLE employees(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP DEFAULT now(),
    created_at TIMESTAMP DEFAULT now(),
    department_id INTEGER REFERENCES department(id) NOT NULL


);


INSERT INTO employees(name, department_id) VALUES('Tom', 1);
INSERT INTO employees(name, department_id) VALUES('Timmy', 2 );
INSERT INTO employees(name, department_id) VALUES('Tamantha', 3);


INSERT INTO departments(name) VALUES('Sales');

INSERT INTO departments(name) VALUES('Janitor');

INSERT INTO departments(name) VALUES('IT Support');


`;

await client.query(SQL);
console.log("database has been seeded");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening in port ${PORT}`));
};

init();

