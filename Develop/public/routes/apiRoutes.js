const router = require("express").Router();
const store = require("../Develop/db/store.js");

//get api/notes to respond with notes from the database
router.get("/notes", function(req, res){
    store
    .getNotes()
    .then(notes => res.json(notes))
    .catch(err => res.status(500).json(err));
});