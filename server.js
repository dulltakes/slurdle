const express = require('express');
const app = express();
const port = 3000;

const mock = require('./mock_api.json');
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
// app.use(express.static('public'));

function getRandomUsers(mockData, count = 5) {
  const selected = new Set();
  const result = [];

  while (result.length < count && selected.size < mockData.length) {
    const randomIndex = Math.floor(Math.random() * mockData.length);
    if (!selected.has(randomIndex)) {
      selected.add(randomIndex);
      result.push(mockData[randomIndex]);
    }
  }

  return result;
}

app.get('/', (req, res) => {
  const users = getRandomUsers(mock, 5);
  const correctUser = users[Math.floor(Math.random() * users.length)];
  res.render('index', { users, correctUser });
});

app.get('/test', (req, res) => {
  const users = getRandomUsers(mock, 5);
  res.render('page');
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
    res.status(404).json({ error: 'Mock user not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
