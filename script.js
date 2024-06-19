document.addEventListener('DOMContentLoaded', () => {
    // Hapus semua skor saat halaman dimuat
    localStorage.removeItem('topScores');
    
    const cat = document.getElementById('cat');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const restartButton = document.getElementById('restart-button');
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('close-popup');
    const popupMessage = document.getElementById('popup-message');
    const meowSound = document.getElementById('meow-sound');
    const backgroundMusic = document.getElementById('background-music');
    const playerNameInput = document.getElementById('player-name');
    const scoreList = document.getElementById('score-list');
    let score = 0;
    let timeLeft = 30; // waktu dalam detik
    let timerInterval;

    // Mulai memutar musik latar ketika halaman dimuat
    

    // Event listener untuk klik pada kucing
    cat.addEventListener('click', () => {
        if (score < 30) {
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            meowSound.currentTime = 0;
            meowSound.play();
            if (score >= 30) {
                endGame("Congratulations! You've reached the maximum score!");
            } else {
                moveCat();
            }
        }
    });

    // Fungsi untuk memindahkan kucing ke posisi acak
    function moveCat() {
        const gameContainer = document.querySelector('.game-container');
        const maxX = gameContainer.clientWidth - cat.clientWidth;
        const maxY = gameContainer.clientHeight - cat.clientHeight;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        cat.style.left = `${randomX}px`;
        cat.style.top = `${randomY}px`;
    }

    // Fungsi untuk menghitung mundur waktu
    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time Left: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endGame("Time's up!");
            }
        }, 1000);
    }

    // Fungsi untuk mengakhiri permainan dan menampilkan popup
    function endGame(message) {
        clearInterval(timerInterval);
        showPopup(message);
        saveScore();
        // Tidak perlu menghentikan musik latar di sini
    }

    // Fungsi untuk menginisialisasi ulang permainan
    function resetGame() {
        clearInterval(timerInterval);
        score = 0;
        timeLeft = 30;
        scoreDisplay.textContent = 'Score: 0';
        timerDisplay.textContent = `Time Left: ${timeLeft}s`;
        moveCat();
        startTimer();
        backgroundMusic.loop = true; // Memastikan musik terus diputar
        backgroundMusic.play().catch((error) => {
        console.log("Autoplay failed, user interaction needed:", error);
    });
        
        // Tidak perlu memanggil playBackgroundMusic() di sini karena musik terus diputar
    }

    // Mengatur ulang permainan ketika tombol restart diklik
    restartButton.addEventListener('click', resetGame);

    // Memulai permainan
    function startGame() {
        resetGame(); 
    }

    // Fungsi untuk menampilkan popup
    function showPopup(message) {
        popupMessage.textContent = `${message} Your score is ${score}.`;
        popup.style.display = 'block';
    }

    // Fungsi untuk menutup popup
    closePopup.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // Fungsi untuk menyimpan skor
    function saveScore() {
        const playerName = playerNameInput.value.trim();
        if (playerName) {
            const scores = getScores();
            scores.push({ name: playerName, score });
            scores.sort((a, b) => b.score - a.score);
            if (scores.length > 5) scores.pop();
            localStorage.setItem('topScores', JSON.stringify(scores));
            displayScores();
        }
    }

    // Fungsi untuk mendapatkan skor dari localStorage
    function getScores() {
        const scores = localStorage.getItem('topScores');
        return scores ? JSON.parse(scores) : [];
    }

    // Fungsi untuk menampilkan skor
    function displayScores() {
        const scores = getScores();
        scoreList.innerHTML = scores.map(s => `<li>${s.name}: ${s.score}</li>`).join('');
    }

    // Inisialisasi permainan
    
    startGame();
    displayScores();
});
