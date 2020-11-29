const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const { ppid } = require('process');
const PORT = process.env.PORT || 3001;
const { notes } = require("./db/db.json")

//boiler plate code-always include
app.use(express.static('public'));
//allows express to use front-end css and js

//parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
app.use(express.json());

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );

    return note;
}

//path for homepage 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//path for notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// const notes = require("./db/db.json");
// to writefile you need to use fs

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();
    const note = createNewNote(req.body, notes);
    res.json(note);
});



app.listen(PORT, () => {
    console.log(`API server now on port${PORT}!`);

});




