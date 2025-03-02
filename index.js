const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

// Setting EJS as view engine
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// To get the static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Route to display the list of files
app.get("/", function (req, res) {
  fs.readdir(`./files`, function (err, files) {
    const query = req.query;
    res.render("index", { files: files, query: query });
  });
});
// Route to display the contents of a specific files
app.get("/file/:filename", function (req, res) {
  fs.readFile(
    `./files/${req.params.filename}`,
    "utf-8",
    function (err, filedata) {
      res.render("show", {
        filename: req.params.filename,
        filedata: filedata,
      });
    }
  );
});
// Route to render edit page for a specific file
app.get("/edit/:filename", function (req, res) {
  res.render("edit", { filename: req.params.filename });
});
// Route to handle file renaming
app.post("/edit", function (req, res) {
  fs.rename(
    `./files/${req.body.previous}`,
    `./files/${req.body.new}.txt`,
    function (err) {
      res.redirect("/");
    }
  );
});

// Route to handle file creation
app.post("/create", function (req, res) {
  const title = req.body.title.trim();
  const details = req.body.details.trim();
  const filename = `${title.split(" ").join("")}.txt`;
  if (!title || !details) {
    return res.redirect("/");
  }
  if (fs.existsSync(`./files/${filename}`)) {
    return res.redirect("/?error=FileAlreadyExists");
  }
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.details,
    function (err) {
      res.redirect("/");
    }
  );
});
// Route to handle file deletion
app.post("/delete", function (req, res) {
  const filename = req.body.filename;
  if (!filename) {
    return res.redirect("/?error=InvalidFile");
  }
  fs.unlink(`./files/${filename}`, function (err) {
    res.redirect("/");
  });
});

// Starting server on port 3000
app.listen(3000);
