const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "mysql-35fbc717-department-management-system.e.aivencloud.com",
  user: "avnadmin",
  password: process.env.DB_PASSWORD,
  database: "defaultdb",
  port: 27745,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = db;