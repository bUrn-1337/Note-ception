const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let notes = JSON.parse(fs.readFileSync('./notes.json', 'utf8') || '{}');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/create', (req, res) => {
  const id = Math.random().toString(36).substring(2, 8);
  notes[id] = req.body.content;
  fs.writeFileSync('./notes.json', JSON.stringify(notes));
  res.redirect(`/note/${id}`);
});

app.get('/note/:id', (req, res) => {
  const content = notes[req.params.id];
  res.render('view', { id: req.params.id, content });
});

app.get('/sandbox.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/sandbox.html'));
});

app.get('/preview', (req, res) => {
    const id = req.query.id;
    const content = notes[id] || 'Note not found.';
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Security-Policy", "sandbox allow-scripts allow-modals");
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Note Preview</title></head>
      <body>
        ${content}
      </body>
      </html>
    `);
  });

app.listen(3000, () => console.log(`CTF app running on http://localhost:3000`));
