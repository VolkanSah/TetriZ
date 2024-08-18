document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.querySelector('.score');
    const pauseButton = document.createElement('button');
    const width = 10;
    let squares = Array.from(grid.querySelectorAll('div'));
    let currentPosition = 4;
    let currentRotation = 0;
    let timerId;
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    let level = 1;
    let fallSpeed = 1000;
    let isPaused = false;

    pauseButton.textContent = 'Pause';
    document.body.appendChild(pauseButton);

    pauseButton.addEventListener('click', () => {
        if (isPaused) {
            timerId = setInterval(moveDown, fallSpeed);
            pauseButton.textContent = 'Pause';
            isPaused = false;
        } else {
            clearInterval(timerId);
            pauseButton.textContent = 'Fortsetzen';
            isPaused = true;
        }
    });

    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];

    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ];

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ];

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ];

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ];

    const jTetromino = [
        [1, width+1, width*2+1, 0],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2+2],
        [width, width+1, width+2, 0]
    ];

    const sTetromino = [
        [1, width, width+1, width*2],
        [width, width+1, width*2+1, width*2+2],
        [1, width, width+1, width*2],
        [width, width+1, width*2+1, width*2+2]
    ];

    const theTetrominoes = [
        lTetromino, zTetromino, tTetromino, oTetromino,
        iTetromino, jTetromino, sTetromino
    ];

    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('active');
        });
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('active');
        });
    }

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keydown', control);

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            random = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            addScore();
            gameOver();
        }
    }

    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                if (score % 50 === 0) { // Steige alle 50 Punkte ein Level auf
                    levelUp();
                }
                scoreDisplay.innerHTML = `Score: ${score} | Highscore: ${highScore} | Level: ${level}`;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('active');
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    function levelUp() {
        level++;
        fallSpeed *= 0.9; // Erhöhe die Geschwindigkeit um 10%
        clearInterval(timerId);
        timerId = setInterval(moveDown, fallSpeed);
    }

    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = `Game Over | Score: ${score} | Highscore: ${highScore}`;
            clearInterval(timerId);
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
            }
        }
    }

    scoreDisplay.innerHTML = `Score: ${score} | Highscore: ${highScore} | Level: ${level}`;
    timerId = setInterval(moveDown, fallSpeed);
});
