const express = require('express');
const app = express();
const port = 3000;

const compression = require('compression');
app.use(compression());

const slurs = require('./ethnic_and_religious_slurs.min.json');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('public'));

app.set('view engine', 'ejs');

const sessions = new Map();

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

function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

app.get('/', (req, res) => {
  const slursList = getRandomSlurs(slurs, 5);
  const correctSlur = slursList[Math.floor(Math.random() * slursList.length)];
  const sessionId = generateSessionId();

  sessions.set(sessionId, {
    slursList, correctSlur, correctIndex: slursList.findIndex(item => item.term === correctSlur.term)
  });

  res.render('index', {slursList, correctSlur, sessionId});
});

app.post('/check-answer', (req, res) => {
  console.log('Request body:', req.body); // Debug log
  console.log('Content-Type:', req.get('Content-Type')); // Debug log

  if (!req.body) {
    console.log('req.body is undefined');
    return res.status(400).json({error: 'Request body is missing'});
  }

  const {sessionId, selectedIndex} = req.body;

  if (!sessionId || selectedIndex === undefined) {
    console.log('Missing sessionId or selectedIndex');
    return res.status(400).json({error: 'Missing required fields'});
  }

  const session = sessions.get(sessionId);
  if (!session) {
    console.log('Session not found:', sessionId);
    return res.status(400).json({error: 'Invalid session'});
  }

  const selectedIndexNum = parseInt(selectedIndex);
  const isCorrect = selectedIndexNum === session.correctIndex;

  console.log('Selected index:', selectedIndexNum, 'Correct index:', session.correctIndex);

  if (isCorrect) {
    // Clean up session only after correct answer
    sessions.delete(sessionId);
    res.json({
      correct: true,
      term: session.correctSlur.term.toLowerCase(),
      targets: session.correctSlur.targets,
      meaning: session.correctSlur.meaning,
      redirect: true
    });
  } else {
    res.json({
      correct: false
    });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
