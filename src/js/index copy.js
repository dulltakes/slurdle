function returnItem(obj) {
    const terms = obj.map(item => item["Term"]);
    const targets = obj.map(item => item["Targets"]);

    // console.log(terms);

    const row = obj[Math.floor(Math.random() * obj.length)];
    const term = row["Term"];
    const target = row["Targets"];
    let randomTargets = [];

    // Filter out the rows with the same term
    const filteredObj = obj.filter(item => item["Term"] !== term);

    // Ensure unique random targets that do not match the actual target or each other
    while (randomTargets.length < 4) {
        const randomItem = filteredObj[Math.floor(Math.random() * filteredObj.length)];
        const randomTarget = randomItem["Targets"];

        if (randomTarget !== target && !randomTargets.includes(randomTarget)) {
            randomTargets.push(randomTarget);
        }
    }

    // Set the content of the HTML elements
    document.getElementById('term').textContent = term;
    document.getElementById('realTarget').textContent = target;

    const falseElements = document.querySelectorAll('.false');
    falseElements.forEach((element, index) => {
        if (randomTargets[index]) {
            element.textContent = randomTargets[index];
        }
    });

    console.log(term, target, randomTargets);
}

fetch('./data.json')
    .then((response) => response.json())
    .then((json) => returnItem(json));
