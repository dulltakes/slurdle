import data from '../assets/combined.min.json';

const slurdleContainer = document.querySelector('#slurdle');
const pageTitle = document.querySelector('#title');
const main = document.querySelector('main');
const nextButton = document.querySelector("#next");

const getContainerWidth = () => {
    console.log(slurdleContainer.clientHeight)
    return slurdleContainer.offsetWidth;
};

const updateTitleFontSize = () => {
    const containerWidth = getContainerWidth();
    pageTitle.style.fontSize = `${Math.round(containerWidth / 4.2)}px`;
};

const handleResize = () => {
    updateTitleFontSize();
};

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

const generateQuestion = (slurs) => {
    const [firstSlur, ...remainingSlurs] = slurs;
    const { Term: question, Targets: answer, 'Meaning, origin and notes': origin } = firstSlur;
    const randomTargets = remainingSlurs.map(item => item.Targets);
    return { question, answer, randomTargets, origin };
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const generateAnswerList = (question) => {
    const answerListItems = [question.answer, ...question.randomTargets].map((item, index) =>
        `<li class="targets${index === 0 ? " answer" : ""}">${item}</li>`
    );
    return shuffleArray(answerListItems).join('\n');
};

const populateQuestion = () => {
    const slurs = generateSlur(data);
    const question = generateQuestion(slurs);
    updateQuestionDisplay(question);
    updateAnswerList(question);
    resetAnswerMessage();
    disableNextButton();
    attachEventListeners();
    setTimeout(updateTitleFontSize, 0); // Ensure the font size is updated after DOM updates
};

const updateQuestionDisplay = (question) => {
    const questionTitle = document.querySelector("#question");
    questionTitle.innerHTML = `
        <p id="question-title">What group of people does this term target:</p>
        <p id="question-term">${question.question}</p>
    `;
};

const updateAnswerList = (question) => {
    const options = document.querySelector("#options");
    options.innerHTML = generateAnswerList(question);
};

const resetAnswerMessage = () => {
    const answerMessage = document.querySelector(".answer-message");
    answerMessage.textContent = "";
    answerMessage.classList.remove("visible");
};

const disableNextButton = () => {
    nextButton.disabled = true;
    nextButton.classList.add("disabled");
};

const enableNextButton = () => {
    nextButton.disabled = false;
    nextButton.classList.remove("disabled");
};

const attachEventListeners = () => {
    const targets = document.querySelectorAll('.targets');
    targets.forEach((item) => {
        item.addEventListener("click", handleAnswerClick);
    });
};

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

nextButton.addEventListener("click", populateQuestion);

window.addEventListener("resize", handleResize);

// Ensure the initial title font size is set after the DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
    populateQuestion();
    updateTitleFontSize();
});