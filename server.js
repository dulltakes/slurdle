const express = require('express');
const app = express();
const port = 3000;

const slurs = require('./ethnic_and_religious_slurs.min.json');

app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');


function getRandomSlurs(slurs, count = 5) {
  const selected = new Set();
  const result = [];

  while (result.length < count && selected.size < slurs.length) {
    const randomIndex = Math.floor(Math.random() * slurs.length);
    if (!selected.has(randomIndex)) {
      selected.add(randomIndex);
      result.push(slurs[randomIndex]);
    }
  }

  return result;
}

app.get('/', (req, res) => {

  const slursList = getRandomSlurs(slurs, 5);
  const correctSlur = slursList[Math.floor(Math.random() * slursList.length)];
  res.render('index', {slursList, correctSlur});
});

app.post('/form-endpoint', (req, res) => {
  const age = req.body.age;
  console.log('Age submitted:', age);

  // You can now render a response or redirect
  res.send(`You submitted age: ${age}`);
});


app.get('/mock/:id', (req, res) => {
  const id = req.params.id;
  const mock_user = mock.find(q => q.id === id);

  if (mock_user) {
    res.json(mock_user);
  } else {
    res.status(404).json({error: 'Mock user not found'});
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
