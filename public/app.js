async function getNames() {
  const users = [];

  const dataLength = await fetch('/mock/length')
    .then(res => res.json());

  for (let i = 0; i < 5; i++) {
    const randomId = Math.floor(Math.random() * dataLength) + 1;
    const user = await fetch(`/mock/${randomId}`).then(res => res.json());
    users.push(user);
  }

  return users;
}

// Create a <ul> list and insert it into #user div
function createList(users) {
  const userDiv = document.getElementById('user');
  userDiv.innerHTML = ''; // Clear previous content

  const ul = document.createElement('ul');

  users.forEach(user => {
    const li = document.createElement('li');
    console.log(user.id)
    li.textContent = user.name;
    ul.appendChild(li);
  });

  userDiv.appendChild(ul);
}

// Handle button click
document.getElementById('start-quiz').addEventListener('click', async () => {
  const names = await getNames();
  createList(names);
});
