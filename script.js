document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.querySelector('.score');
    const width = 10;
    let squares = Array.from(grid.querySelectorAll('div'));
    let currentPosition = 4;
    let currentRotation = 0;
    let timerId;
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;

    // Die Tetrominoes
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

    // Zeichne das Tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('active');
        });
    }

    // Lösche das Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('active');
        });
    }

    // Tetromino bewegen
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    // Steuerung mit den Pfeiltasten
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

    // Bewege das Tetromino nach links
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }

    // Bewege das Tetromino nach rechts
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    // Drehe das Tetromino
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    // Überprüfe ob das Tetromino den Boden oder ein anderes Tetromino erreicht hat
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

    // Punkte hinzufügen
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = 'Score: ' + score + ' | Highscore: ' + highScore;
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

    // Spielende
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'Game Over | Score: ' + score + ' | Highscore: ' + highScore;
            clearInterval(timerId);
            // Aktualisiere Highscore
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
            }
        }
    }

    // Starte das Spiel
    scoreDisplay.innerHTML = 'Score: ' + score + ' | Highscore: ' + highScore;
    timerId = setInterval(moveDown, 1000);
});
