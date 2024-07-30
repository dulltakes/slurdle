import data from '../assets/combined.min.json';

const getScreenWidth = () => {
    return window.innerWidth;
}

const updateTitleFontSize = () => {
    const pageTitle = document.querySelector('#title');
    pageTitle.style.fontSize = `${getScreenWidth() / 4.5}px`;
    const titleOffset = pageTitle.offsetHeight;
    const main = document.querySelector('main');
    main.offsetTop = "100px"
    // console.log(titleOffset);
}

// Initialize the font size
updateTitleFontSize();

// Update the font size on window resize
window.onresize = () => {
    updateTitleFontSize();
}
// Function to generate random slurs
const generateSlur = (obj, numTargets = 4) => {
    const dataLength = obj.length;
    const randomTargets = [];
    while (randomTargets.length <= numTargets) {
        const randomIndex = Math.floor(Math.random() * dataLength);
        const randomTarget = obj[randomIndex];
        if (!randomTargets.includes(randomTarget)) {
            randomTargets.push(randomTarget);
        }
    }
    return randomTargets;
};

// Function to generate question details
const generateQuestion = (slurs) => {
    const [firstSlur, ...remainingSlurs] = slurs;
    const { Term: question, Targets: answer, 'Meaning, origin and notes': origin } = firstSlur;
    const randomTargets = remainingSlurs.map(item => item.Targets);
    return { question, answer, randomTargets, origin };
};

// Function to shuffle an array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Function to generate the list of answers
const generateAnswerList = (question) => {
    const answerListItems = [question.answer, ...question.randomTargets].map((item, index) =>
        `<li class="targets${index === 0 ? " answer" : ""}">${item}</li>`
    );
    return shuffleArray(answerListItems).join('\n');
};

// Function to populate the question
const populateQuestion = () => {
    const slurs = generateSlur(data);
    const question = generateQuestion(slurs);
    updateQuestionDisplay(question);
    updateAnswerList(question);
    resetAnswerMessage();
    disableNextButton();
    attachEventListeners();
};

// Function to update the question display
const updateQuestionDisplay = (question) => {
    const questionTitle = document.querySelector("#question");
    questionTitle.innerHTML = `
        <p id="question-title">What group of people does this term target:</p>
        <p id="question-term">${question.question}</p>
    `;
};

// Function to update the answer list
const updateAnswerList = (question) => {
    const options = document.querySelector("#options");
    options.innerHTML = generateAnswerList(question);
};

// Function to reset the answer message
const resetAnswerMessage = () => {
    const answerMessage = document.querySelector(".answer-message");
    answerMessage.textContent = "";
    answerMessage.classList.remove("visible");
};

// Function to disable the next button
const disableNextButton = () => {
    nextButton.disabled = true;
    nextButton.classList.add("disabled");
};

// Function to enable the next button
const enableNextButton = () => {
    nextButton.disabled = false;
    nextButton.classList.remove("disabled");
};

// Function to attach event listeners to targets
const attachEventListeners = () => {
    const targets = document.querySelectorAll('.targets');
    targets.forEach((item) => {
        item.addEventListener("click", handleAnswerClick);
    });
};

// Event handler for answer clicks
const handleAnswerClick = (event) => {
    const answerMessage = document.querySelector(".answer-message");
    if (event.target.classList.contains('answer')) {
        event.target.classList.add("correct");
        answerMessage.textContent = "Well done!";
        answerMessage.classList.add("visible");
        enableNextButton();
    } else {
        event.target.classList.add("false");
    }
};

// Event listener for the next button
const nextButton = document.querySelector("#next");
nextButton.addEventListener("click", populateQuestion);

// Initialize the first question
populateQuestion();