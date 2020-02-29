const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;
const fs = require('fs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


app.get('/api/notes', (req, res) => {
    let currentnotes = fs.readFileSync('./db/db.json');
    let currentNotes = JSON.parse(currentnotes);
    return res.json(currentNotes);
});

app.post('/api/notes', (req, res) => {
    const newNotes = req.body;
    let currentnotes = JSON.parse(fs.readFileSync('./db/db.json'));
    currentnotes.push(newNotes);
    let newList = JSON.stringify(currentnotes);
    fs.writeFileSync('./db/db.json', newList);
    return res.json(newList);
});

app.delete('/api/notes/:id', (req, res) => {
    let notes = JSON.parse(fs.readFileSync('./db/db.json')); //read json file
    for (let i = 0; i < notes.length; i++) {
        //delete targeted notes and return to json file
        if (req.params.id == notes[i].id) {
            delete notes[i];
            const filternotes = notes.filter(function (item) {
                return item !== null
            })
            fs.writeFileSync('./db/db.json', JSON.stringify(filternotes));
        }
    }
    return res.json(notes);
})

app.get('/notes', (req, res) => {
    return res.sendFile(path.join(__dirname, "public/notes.html"))
});
app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, "public/index.html"))
});


app.listen(PORT, () => {
    console.log(`${PORT} running`);
})
