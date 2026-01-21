document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const animatedText = document.getElementById("animatedText");
  const character = document.getElementById("character");
  const speechBox = document.getElementById("speech-box");
  const speechText = document.getElementById("speech-text");
  const nameInput = document.getElementById("playerNameInput");

  // Create background effects
  createBackgroundEffects();

  const dialogueScript = [
    "TAP ANYWHERE TO CONTINUE",
    "HELLO, I AM ANUJ",
    "YOU ARE WELCOME TO MY WEBSITE",
    "Before we start, please enter your name:",
    "Great! Nice to meet you, {{name}}! Let's start the quiz!"
  ];

  let scriptIndex = -1;
  let dialogueActive = false;
  let isWaitingInput = false;
  let playerName = "Player";

  // ================= CREATE BACKGROUND EFFECTS =================
  function createBackgroundEffects() {
    // Add grid background
    const grid = document.createElement('div');
    grid.className = 'grid-bg';
    document.body.appendChild(grid);

    // Add floating quiz-themed shapes
    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'floating-shapes';
    document.body.appendChild(shapesContainer);

    const quizShapes = [
      { symbol: '?', class: 'question', count: 3 },
      { symbol: '💡', class: 'lightbulb', count: 2 },
      { symbol: '⭐', class: 'star', count: 3 },
      { symbol: '✓', class: 'check', count: 2 },
      { symbol: '✗', class: 'cross', count: 2 }
    ];

    quizShapes.forEach(shapeType => {
      for (let i = 0; i < shapeType.count; i++) {
        const shapeEl = document.createElement('div');
        shapeEl.className = `shape ${shapeType.class}`;
        shapeEl.textContent = shapeType.symbol;
        
        shapeEl.style.left = Math.random() * 90 + '%';
        shapeEl.style.top = Math.random() * 90 + '%';
        shapeEl.style.animationDelay = Math.random() * 2 + 's';
        shapeEl.style.animationDuration = (Math.random() * 8 + 12) + 's';
        
        shapesContainer.appendChild(shapeEl);
      }
    });
  }

  // ================= WELCOME ANIMATION =================
  const sentence = "WELCOME TO THE QUIZ OF ANUJ SUBEDI";
  const words = sentence.split(" ");

  words.forEach((word, wIndex) => {
    const wordDiv = document.createElement("div");
    wordDiv.style.display = "flex";
    wordDiv.style.justifyContent = "center";
    wordDiv.style.marginBottom = "10px";
    const isHighlight = word === "ANUJ" || word === "SUBEDI";

    word.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char;
      if (isHighlight) span.classList.add("highlight");
      span.style.opacity = 0;
      span.style.transform = `scale(0.5) translateY(${Math.random()*-100-20}px) rotate(${Math.random()*360-180}deg)`;
      wordDiv.appendChild(span);

      setTimeout(() => {
        span.style.opacity = 1;
        span.style.transform = "scale(1) translateY(0) rotate(0deg)";
      }, i*100 + wIndex*400);
    });

    animatedText.appendChild(wordDiv);
  });

  const lastWordIndex = words.length - 1;
  const lastWordLength = words[lastWordIndex].length;
  const startBtnDelay = lastWordIndex * 400 + (lastWordLength-1) * 100 + 300;
  setTimeout(() => startBtn.classList.remove("hidden"), startBtnDelay);

  // ================= DIALOGUE FUNCTIONS =================
  let typingTimeout = null;

  function typeWriter(text, element, speed = 50) {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      typingTimeout = null;
    }
    
    element.textContent = '';
    let i = 0;
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        typingTimeout = setTimeout(type, speed);
      } else {
        typingTimeout = null;
      }
    }
    type();
  }

  function showDialogue(text) {
    text = text.replace("{{name}}", playerName);
    speechBox.style.display = "block";

    if (character.style.display !== "block") {
      character.style.display = "block";
      character.style.animation = "characterBounce 0.6s ease-out";
      setTimeout(() => {
        character.style.transform = "translate(-50%, -50%)";
      }, 600);
    }

    typeWriter(text, speechText, 30);
  }

  function nextDialogue() {
    if (!dialogueActive) return;

    scriptIndex++;
    if (scriptIndex >= dialogueScript.length) {
      dialogueActive = false;
      speechBox.style.display = "none";
      character.style.display = "none";
      animatedText.style.transition = "opacity 0.8s";
      animatedText.style.opacity = 0;
      
      setTimeout(() => {
        startQuiz();
      }, 1000);
      return;
    }

    if (scriptIndex === 3) {
      nameInput.style.display = "block";
      nameInput.focus();
      isWaitingInput = true;
    } else {
      nameInput.style.display = "none";
      isWaitingInput = false;
    }

    showDialogue(dialogueScript[scriptIndex]);
  }

  // ================= START BUTTON =================
  startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    startBtn.classList.add("hidden");
    
    animatedText.style.transition = "opacity 0.8s";
    animatedText.style.opacity = 0;

    // Show music popup first
    setTimeout(() => {
      showMusicConfirmation();
    }, 800);
  });

  // Music confirmation popup
  function showMusicConfirmation() {
    const popup = document.createElement('div');
    popup.className = 'music-popup';
    popup.innerHTML = `
      <div class="music-popup-content">
        <h3>Do you want music?</h3>
        <div class="music-popup-buttons">
          <button class="music-btn music-yes">Yes</button>
          <button class="music-btn music-no">No</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);

    const yesBtn = popup.querySelector('.music-yes');
    const noBtn = popup.querySelector('.music-no');
    let noDodgeCount = 0;

    yesBtn.addEventListener('click', () => {
      startBackgroundMusic();
      popup.remove();
      // Start dialogues after choosing music
      dialogueActive = true;
      nextDialogue();
    });

    // Make "No" button run away ONLY on click
    noBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dodgeNoButton(noBtn);
    });

    function dodgeNoButton(btn) {
      noDodgeCount++;
      
      // After 3 dodges, remove No button and only leave Yes
      if (noDodgeCount >= 3) {
        btn.style.transition = 'all 0.3s';
        btn.style.opacity = '0';
        btn.style.transform = 'scale(0)';
        setTimeout(() => {
          btn.remove();
          const heading = popup.querySelector('h3');
          heading.textContent = 'Music it is! 🎵';
          
          // Auto-start music and dialogues after 1 second
          setTimeout(() => {
            startBackgroundMusic();
            popup.remove();
            dialogueActive = true;
            nextDialogue();
          }, 1000);
        }, 300);
        return;
      }

      // Random position within the popup
      const maxX = window.innerWidth - 200;
      const maxY = window.innerHeight - 100;
      const randomX = Math.random() * maxX;
      const randomY = Math.random() * maxY;

      btn.style.position = 'fixed';
      btn.style.left = randomX + 'px';
      btn.style.top = randomY + 'px';
      btn.style.transition = 'all 0.2s ease-out';

      // Shake animation
      btn.style.animation = 'none';
      setTimeout(() => {
        btn.style.animation = 'shake 0.3s';
      }, 10);
    }
  }

  // ================= CLICK TO ADVANCE =================
  document.addEventListener("click", (e) => {
    if (!dialogueActive) return;
    if (e.target === nameInput) return;
    if (e.target === startBtn) return;

    if (isWaitingInput) {
      playerName = nameInput.value.trim() || "Player";
      nameInput.style.display = "none";
      isWaitingInput = false;
      nextDialogue();
    } else {
      nextDialogue();
    }
  });

  // ================= NAME INPUT =================
  nameInput.addEventListener("keydown", (e) => {
    if (!dialogueActive) return;
    if (e.key === "Enter") {
      playerName = nameInput.value.trim() || "Player";
      nameInput.style.display = "none";
      isWaitingInput = false;
      nextDialogue();
    }
  });

  // ================= QUIZ LOGIC =================
  const quizContainer = document.getElementById("quizContainer");
  const questionText = document.getElementById("questionText");
  const questionNumber = document.getElementById("questionNumber");
  const answerButtons = document.querySelectorAll(".answer-btn");
  const quizCharacter = document.getElementById("quizCharacter");

  // ================= CHARACTER EXPRESSION IMAGES =================
  const characterImages = {
    neutral: "host.png",
    happy: "host-happy.png",
    sad: "host-sad.png",
    celebrate: "host-celebrate.png"
  };

  function changeExpression(expression) {
    if (characterImages[expression]) {
      quizCharacter.style.opacity = '0';
      
      setTimeout(() => {
        quizCharacter.src = characterImages[expression];
        quizCharacter.style.opacity = '1';
      }, 200);
    }
  }

  // ⭐ ANUJ'S PERSONALIZED QUIZ QUESTIONS ⭐
  const questions = [
    {
      question: "When is my birthday?",
      options: ["Kartik 6", "Kartik 7", "Mangsir 6", "Mangsir 7"],
      correct: 0
    },
    {
      question: "What is my height?",
      options: ["6 feet", "5 feet 2 inch", "5 feet 4 inch", "5 feet 8 inch"],
      correct: 2
    },
    {
      question: "What's my favourite chocolate?",
      options: ["Dairy Milk", "Snickers", "KitKat", "Kinder Joy"],
      correct: 1
    },
    {
      question: "What is my favourite food?",
      options: ["Jhol Momo", "Sekuwa", "Daal Bhat", "Pasta"],
      correct: 0
    },
    {
      question: "What is my SEE GPA?",
      options: ["4.0", "3.7", "3.8", "3.9"],
      correct: 1
    },
    {
      question: "How many schools and colleges have I studied in?",
      options: ["4", "3", "2", "5"],
      correct: 0
    },
    {
      question: "What type of song do I like?",
      options: ["Rock", "Romantic", "Classical", "Jazz"],
      correct: 0
    },
    {
      question: "What is my hobby?",
      options: ["Music", "Football", "Drawing", "Dancing"],
      correct: 0
    },
    {
      question: "What is my horoscope?",
      options: ["मेष (Mesh)", "कर्कट (Karkat)", "कुम्भ (Kumbh)", "मीन (Meen)"],
      correct: 1
    },
    {
      question: "Who is my favourite band?",
      options: ["Axis", "Tribal Rain", "Mantra", "1947 AD"],
      correct: 0
    }
  ];

  let currentQuestion = 0;
  let score = 0;
  let isAnswering = false;

  // ================= SOUND EFFECTS =================
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Background Music - Using Audio File
  let backgroundMusic = null;

  function startBackgroundMusic() {
    if (!backgroundMusic) {
      backgroundMusic = new Audio('background-music.mp3');
      backgroundMusic.loop = true;
      backgroundMusic.volume = 0.15;
      
      backgroundMusic.play().catch(err => {
        console.log('Music autoplay blocked, will start on user interaction');
        document.addEventListener('click', () => {
          if (backgroundMusic.paused) {
            backgroundMusic.play();
          }
        }, { once: true });
      });
      
      // Connect volume slider to music
      const volumeSlider = document.getElementById('volumeSlider');
      const volumeIcon = document.querySelector('.volume-icon');
      if (volumeSlider) {
        volumeSlider.value = backgroundMusic.volume * 100;
        volumeSlider.addEventListener('input', (e) => {
          const volume = e.target.value / 100;
          backgroundMusic.volume = volume;
          
          // Update icon based on volume
          if (volume === 0) {
            volumeIcon.textContent = '🔇';
          } else if (volume < 0.5) {
            volumeIcon.textContent = '🔉';
          } else {
            volumeIcon.textContent = '🔊';
          }
        });
      }
    }
  }

  function stopBackgroundMusic() {
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
  }

  function playCorrectSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    const oscillator2 = audioContext.createOscillator();
    const gainNode2 = audioContext.createGain();
    
    oscillator2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);
    
    oscillator2.frequency.value = 1000;
    oscillator2.type = 'sine';
    
    gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator2.start(audioContext.currentTime + 0.1);
    oscillator2.stop(audioContext.currentTime + 0.6);
  }

  function playWrongSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }

  function playCelebrationSound() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    
    notes.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      const startTime = audioContext.currentTime + (index * 0.15);
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.4);
    });
  }

  function startQuiz() {
    document.querySelector('.welcome').style.display = 'none';
    quizContainer.classList.add('active');
    showQuestion();
  }

  function showQuestion() {
    if (currentQuestion < questions.length) {
      const q = questions[currentQuestion];
      questionText.textContent = q.question;
      questionNumber.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
      
      changeExpression('neutral');
      isAnswering = false;
      
      answerButtons.forEach((btn, i) => {
        btn.textContent = q.options[i];
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong');
      });
    } else {
      showResults();
    }
  }

  function showResults() {
    const questionContainer = document.querySelector('.question-container');
    const percentage = (score / questions.length) * 100;
    let message = "";
    
    playCelebrationSound();
    changeExpression('celebrate');
    
    if (percentage === 100) {
      message = "Perfect! You know me so well! 🎉";
    } else if (percentage >= 70) {
      message = "Great job! You know me pretty well! 😊";
    } else if (percentage >= 40) {
      message = "Not bad! But there's more to learn about me! 🤔";
    } else {
      message = "Looks like we need to spend more time together! 😅";
    }
    
    questionContainer.innerHTML = `
      <div class="results-container">
        <h2>Quiz Complete!</h2>
        <div class="score-display">${score} / ${questions.length}</div>
        <p>${playerName}, you got ${Math.round(percentage)}% correct!</p>
        <p>${message}</p>
        <button class="restart-btn" onclick="location.reload()">Try Again</button>
      </div>
    `;
  }

  // ================= ANSWER BUTTON CLICKS =================
  answerButtons.forEach((btn, buttonIndex) => {
    btn.addEventListener('click', function() {
      if (isAnswering) return;
      
      isAnswering = true;
      const selectedIndex = buttonIndex;
      const correctIndex = questions[currentQuestion].correct;
      
      answerButtons.forEach(b => b.disabled = true);
      
      if (selectedIndex === correctIndex) {
        score++;
        btn.classList.add('correct');
        playCorrectSound();
        changeExpression('happy');
      } else {
        btn.classList.add('wrong');
        playWrongSound();
        changeExpression('sad');
        answerButtons[correctIndex].classList.add('correct');
      }
      
      setTimeout(() => {
        currentQuestion++;
        showQuestion();
      }, 1500);
    });
  });
});