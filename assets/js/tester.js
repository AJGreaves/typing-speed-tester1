document.addEventListener("DOMContentLoaded", function () {
    const difficulties = {
        easy: ["A simple sentence.", "The quick brown fox.", "Sunny days are nice.", "Apples are sweet.", "I like to read."],
        medium: [
            "The quick brown fox jumps over the lazy dog.",
            "Complexity adds flavor to life.",
            "Programming challenges are fun.",
            "Always look on the bright side of life.",
            "Persistence guarantees that results are inevitable.",
        ],
        difficult: [
            "Pseudopseudohypoparathyroidism is a condition.",
            "The vixen jumped quickly on her foe barking with zeal.",
            "The job requires extra pluck and zeal from every young wage earner.",
            "A quick movement of the enemy will jeopardize six gunboats.",
            "All questions asked by five watched experts amaze the judge.",
        ],
    };
    const bestScores = {
        easy: {
            time: 0,
            wpm: 0,
        },
        medium: {
            time: 0,
            wpm: 0,
        },
        difficult: {
            time: 0,
            wpm: 0,
        },
    };
    const sampleTextDiv = document.getElementById("sample-text");
    const typingInput = document.getElementById("typing-input");
    const difficultySelect = document.getElementById("difficulty-select");
    const retryButton = document.getElementById("retry-button");
    let selectedDifficulty = "easy"; // Default difficulty
    let sampleText = "";
    let startTime;
    let endTime;

    // Function to start the timer
    function startTimer() {
        if (!startTime) {
            // Start the timer only if it hasn't started yet
            startTime = new Date();
        }
    }

    // Function to end the timer and calculate the elapsed time in minutes
    function endTimer() {
        endTime = new Date();
        const elapsedTime = (endTime - startTime) / 60000; // Convert milliseconds to minutes
        return elapsedTime;
    }

    // Function to select a random sentence based on difficulty
    function selectRandomSentence(difficulty) {
        const sentences = difficulties[difficulty];
        const randomIndex = Math.floor(Math.random() * sentences.length);
        return sentences[randomIndex];
    }

    // Function to update the sample text based on selected difficulty
    function updateSampleText() {
        sampleText = selectRandomSentence(selectedDifficulty);
        let result = "";
        for (let i = 0; i < sampleText.length; i++) {
            result += `<span>${sampleText[i]}</span>`;
        }
        sampleTextDiv.innerHTML = result;
    }

    // Modify the checkTypingCompletion function to store results
    function checkTypingCompletion() {
        const inputText = typingInput.value;
        if (inputText.length === sampleText.length) {
            typingInput.disabled = true; // Disable further typing
            const elapsedTime = endTimer();
            const totalTime = Math.round(elapsedTime * 60); // Convert to seconds
            const wordCount = sampleText.split(" ").length;
            const wpm = Math.round(wordCount / elapsedTime);

            // Display the results
            document.getElementById("time-result").textContent = `${totalTime}s`;
            document.getElementById("wpm-result").textContent = wpm;

            // update and display best scores
            updateBestScores(selectedDifficulty, totalTime, wpm);
            displayBestScores();
        }
    }

    // Initial sample text update
    updateSampleText();

    // Event listener for difficulty selection change
    difficultySelect.addEventListener("change", function () {
        selectedDifficulty = difficultySelect.value;
        updateSampleText();
        typingInput.value = ""; // Reset the input field for a new test
        startTime = undefined; // Reset the start time
        typingInput.disabled = false; // Enable the input field for a new test
    });

    // Event listener for input to color the typed text
    typingInput.addEventListener("input", function () {
        startTimer();
        const inputText = typingInput.value;
        const sampleTextSpans = sampleTextDiv.querySelectorAll("span");
        sampleTextSpans.forEach((charSpan, index) => {
            if (inputText[index] == null) {
                charSpan.classList.remove("correct", "incorrect"); // No input yet
            } else if (inputText[index] === charSpan.innerText) {
                charSpan.classList.add("correct");
                charSpan.classList.remove("incorrect");
            } else {
                charSpan.classList.add("incorrect");
                charSpan.classList.remove("correct");
            }
        });
        checkTypingCompletion();
    });

    // Function to reset the test
    retryButton.addEventListener("click", function resetTest() {
        updateSampleText();
        typingInput.value = ""; // Reset the input field
        startTime = undefined; // Reset the start time
        typingInput.disabled = false; // Enable the input field
        document.getElementById("time-result").innerText = "0s"; // Reset time result
        document.getElementById("wpm-result").innerText = "0"; // Reset WPM result
    });

    function updateBestScores(difficulty, time, wpm) {
        if (time < bestScores[difficulty].time || bestScores[difficulty].time === 0) {
            bestScores[difficulty].time = time;
        }
        if (wpm > bestScores[difficulty].wpm) {
            bestScores[difficulty].wpm = wpm;
        }
    }

    function displayBestScores() {
        document.getElementById("easy-best-time").textContent = `${bestScores.easy.time}s`;
        document.getElementById("easy-best-wpm").textContent = bestScores.easy.wpm;
        document.getElementById("medium-best-time").textContent = `${bestScores.medium.time}s`;
        document.getElementById("medium-best-wpm").textContent = bestScores.medium.wpm;
        document.getElementById("difficult-best-time").textContent = `${bestScores.difficult.time}s`;
        document.getElementById("difficult-best-wpm").textContent = bestScores.difficult.wpm;
    }
});
