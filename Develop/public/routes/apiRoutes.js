const router = require("express").Router();
const store = require("../Develop/db/store.js");

//get api/notes to respond with notes from the database
router.get("/notes", function (req, res) {
    store
        .getNotes()
        .then(notes => res.json(notes))
        .catch(err => res.status(500).json(err));
});

router.post("/notes", (req, res) => {
store
    .addNotes(req.body)
    .then(note => res.json(note))
    .catch(err => res.status(500).json(err));
});

//Bonus! This is the bonus part of the assigment, delete the note w/ equal id to req.params.id
router.delete("/notes/:id", function(req, res) {
    store
    .removeNote(req.params.id)
    .then(() => res.json({ok: true }))
    .catch.(err => res.status(500).json(err));
});

module.exports = router;