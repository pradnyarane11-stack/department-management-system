const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

db.connect((err) => {
  if (err) {
    console.log("Database Connection Failed");
    console.log(err);
  } else {
    console.log("Database Connected Successfully");

    db.query(`
      CREATE TABLE IF NOT EXISTS department (
        dept_id INT AUTO_INCREMENT PRIMARY KEY,
        dept_name VARCHAR(100) NOT NULL,
        description VARCHAR(300),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        status TINYINT(1) DEFAULT 1
      )
    `, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Department table created");

        db.query(
          "SELECT COUNT(*) AS total FROM department",
          (err, result) => {
            if (!err && result[0].total === 0) {
              db.query(`
                INSERT INTO department (dept_name, description, status)
                VALUES
                ('Computer Science Engineering (CSE)', 'Focuses on software development, programming, artificial intelligence, data structures, and computer systems.', 1),
                ('Information Technology (IT)', 'Deals with networking, database management, cybersecurity, cloud computing, and IT infrastructure.', 1),
                ('Electronics and Communication Engineering (ECE)', 'Covers electronic circuits, communication systems, embedded systems, and signal processing technologies.', 1),
                ('Electrical Engineering (EE)', 'Focuses on power systems, electrical machines, control systems, and renewable energy technologies.', 1),
                ('Mechanical Engineering (ME)', 'Involves machine design, manufacturing processes, thermodynamics, robotics, and industrial automation.', 1)
              `, (err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Sample departments inserted");
                }
              });
            }
          }
        );
      }
    });
  }
});

// Home Route
app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

// Dashboard + Search
app.get("/dashboard", (req, res) => {
  const search = req.query.search || "";

  db.query(
    "SELECT * FROM department WHERE status = 1 AND dept_name LIKE ?",
    [`%${search}%`],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }

      res.render("dashboard", {
        departments: result,
        search: search,
      });
    }
  );
});

// Create Page
app.get("/create", (req, res) => {
  res.render("create");
});

// Save Department
app.post("/create", (req, res) => {
  const { dept_name, description } = req.body;

  db.query(
    "INSERT INTO department (dept_name, description) VALUES (?, ?)",
    [dept_name, description],
    (err) => {
      if (err) {
        console.log(err);
        return res.send("Insert Error");
      }

      res.redirect("/dashboard");
    }
  );
});

// Edit Page
app.get("/edit/:id", (req, res) => {
  db.query(
    "SELECT * FROM department WHERE dept_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Edit Error");
      }

      res.render("edit", {
        department: result[0],
      });
    }
  );
});

// Update Department
app.post("/edit/:id", (req, res) => {
  const { dept_name, description } = req.body;

  db.query(
    "UPDATE department SET dept_name = ?, description = ? WHERE dept_id = ?",
    [dept_name, description, req.params.id],
    (err) => {
      if (err) {
        console.log(err);
        return res.send("Update Error");
      }

      res.redirect("/dashboard");
    }
  );
});

// Soft Delete
app.get("/delete/:id", (req, res) => {
  db.query(
    "UPDATE department SET status = 0 WHERE dept_id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.log(err);
        return res.send("Delete Error");
      }

      res.redirect("/dashboard");
    }
  );
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});