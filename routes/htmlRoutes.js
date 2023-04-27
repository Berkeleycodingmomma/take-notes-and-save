var path = require("path");
var router = require("express").Router();


//notes reponding with notes.html
router.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/notes.html"));
});


//ALL other routes responding with index.html
router.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;