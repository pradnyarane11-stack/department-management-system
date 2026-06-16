const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "mysql-35fbc717-department-management-system.e.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_yOJCXtD0nL3iwKsGojx",
  database: "defaultdb",
  port: 27745,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect((err) => {
  if (err) {
    console.log("Database Connection Failed");
    console.log(err);
  } else {
    console.log("Database Connected Successfully");
  }
});

module.exports = db;