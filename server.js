const pg = require("pg");

const client = new.pg.Client(
    process.env.DATABASE_URL || 'postgres://localhost/hr_directory_db'

)

async function init() {
    client.connect();

const SQL = `


`;


}