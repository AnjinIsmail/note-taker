const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const { ppid } = require('process');
const PORT = process.env.PORT || 3001;
const { notes } = require("./db/db.json");
const { endianness } = require('os');
const { pathToFileURL } = require('url');

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

function findById(id, notesArray) {
    const result = notesArray.filter(notes => notes.id === id)[0];
    return result;
}



//in order to delete a "note", first a need a route that is identified by ID 
app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});


app.delete('/api/notes/:id', (req, res) => {
    let deleteId = req.params.id; //Get the id through req.params.id of the object you are going to delete
    let deleteObj = notes.find(notes => notes.id == deleteId); // As you have only Id of the object, we want to get the entire object from the array. find() will fetch the object from the array whose id is equal to deleteId and assign it to deleteObj.
    let deleteIndex = notes.indexOf(deleteObj); //Find the index of the object fetched from the JSON array.
    notes.splice(deleteIndex, 1); // Splice/ remove the object from the JSON Array.
    res.send(deleteObj);
});

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();
    const note = createNewNote(req.body, notes);
    res.json(note);
});



app.listen(PORT, () => {
    console.log(`API server now on port${PORT}!`);
});




