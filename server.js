const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Home Route
app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

// Dashboard + Search
app.get("/dashboard", (req, res) => {
  const search = req.query.search || "";

  const sql =
    "SELECT * FROM department WHERE status = 1 AND dept_name LIKE ?";

  db.query(sql, [`%${search}%`], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }

    res.render("dashboard", {
      departments: result,
      search: search,
    });
  });
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
})