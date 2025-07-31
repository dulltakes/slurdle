document.getElementById('slur-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
        params.append(key, value);
    }

    try {
        const response = await fetch('/check-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error('Server returned non-JSON response');
        }

        const result = await response.json();
        const resultDiv = document.getElementById('result');

        if (result.correct) {
            const formContainer = document.getElementById('slur-form');
            formContainer.innerHTML = `
                <div class="correct-message">
                    <h3 class="correct-title">Correct!</h3>
                    <p><strong>${result.term}</strong> targets <strong>${result.targets}</strong></p>
                    <p><strong>Meaning:</strong> ${result.meaning == null ? "Your guess is as good as ours" : result.meaning}</p>
                    <button class="next-question-button" onclick="window.location.href='/'">Next Question</button>
                </div>
            `;
            resultDiv.innerHTML = '';
        } else {
            resultDiv.innerHTML = `<p id="try-again">Try again!</p>`;
            const checkedInput = document.querySelector('input[name="selectedIndex"]:checked');
            if (checkedInput) checkedInput.checked = false;

            // Fade out the try-again box after 2 seconds
            const tryAgainElement = document.getElementById('try-again');
            setTimeout(() => {
                tryAgainElement.style.transition = 'opacity 0.25s ease-out, transform 0.25s ease-out';
                tryAgainElement.style.opacity = '0';
                tryAgainElement.style.transform = 'translate(-50%, -50%) scale(0.9)';

                // Remove the element completely after fade animation completes
                setTimeout(() => {
                    if (tryAgainElement.parentNode) {
                        tryAgainElement.parentNode.removeChild(tryAgainElement);
                    }
                }, 500); // Wait for fade animation to complete
            }, 2000); // Wait 2 seconds before starting fade
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
});
