//The tetrominoes are defined here. Each tetromino is an array of length 4 for each rotational state.
//Rotational logic is defined by the original game boy game, which is also laid out by:
//https://strategywiki.org/wiki/Tetris/Rotation_systems
const tetrominoes = {
    line: [
        [[0, 0, 0, 0],
         [0, 0, 0, 0],
         [1, 1, 1, 1],
         [0, 0, 0, 0]],

        [[0, 1, 0, 0],
         [0, 1, 0, 0],
         [0, 1, 0, 0],
         [0, 1, 0, 0]],

         //The line piece repeats two rotations
        [[0, 0, 0, 0],
         [0, 0, 0, 0],
         [1, 1, 1, 1],
         [0, 0, 0, 0]],

        [[0, 1, 0, 0],
         [0, 1, 0, 0],
         [0, 1, 0, 0],
         [0, 1, 0, 0]]
    ],

    //The square doesn't actually rotate, but 4 states are here for consistency.
    square: [
        [[1, 1],
         [1, 1]],

        [[1, 1],
         [1, 1]],

        [[1, 1],
         [1, 1]],

        [[1, 1],
         [1, 1]]
    ],

    tBlock: [
        [[0, 1, 0],
         [1, 1, 1],
         [0, 0, 0]],

        [[0, 1, 0],
         [0, 1, 1],
         [0, 1, 0]],

        [[0, 0, 0],
         [1, 1, 1],
         [0, 1, 0]],

        [[0, 1, 0],
         [1, 1, 0],
         [0, 1, 0]]
    ],

    squiggle: [
        [[0, 0, 0],
         [0, 1, 1],
         [1, 1, 0]],

        [[1, 0, 0],
         [1, 1, 0],
         [0, 1, 0]],

        [[0, 0, 0],
         [0, 1, 1],
         [1, 1, 0]],

        [[1, 0, 0],
         [1, 1, 0],
         [0, 1, 0]]
    ],

    reverseSquiggle: [
        [[0, 0, 0],
         [1, 1, 0],
         [0, 1, 1]],

        [[0, 1, 0],
         [1, 1, 0],
         [1, 0, 0]],

        [[0, 0, 0],
         [1, 1, 0],
         [0, 1, 1]],

        [[0, 1, 0],
         [1, 1, 0],
         [1, 0, 0]],
    ],

    lBlock: [
        [[0, 0, 0],
         [1, 1, 1],
         [1, 0, 0]],

        [[1, 1, 0],
         [0, 1, 0],
         [0, 1, 0]],

        [[0, 0, 1],
         [1, 1, 1],
         [0, 0, 0]],

        [[0, 1, 0],
         [0, 1, 0],
         [0, 1, 1]]
    ],

    reverseLBlock: [
        [[0, 0, 0],
         [1, 1, 1],
         [0, 0, 1]],

        [[0, 1, 0],
         [0, 1, 0],
         [1, 1, 0]],

        [[1, 0, 0],
         [1, 1, 1],
         [0, 0, 0]],

        [[0, 1, 1],
         [0, 1, 0],
         [0, 1, 0]]
    ]
};

//This is a parallel list to tetronimoes filled with colors for each tetronimo.
/*
const colors = {
    line: "deepskyblue",
    square: "yellow",
    tBlock: "orchid",
    reverseLBlock: "royalblue",
    lBlock: "goldenrod",
    squiggle: "red",
    reverseSquiggle: "limegreen"
}
*/

/*
This is the beginning of AI-generated code from OpenAI.
This code is also a parallel list to tetrominoes filled with colors, but now in RGB values.
I genuinely could not be bothered to actually get these values.
*/
const colors = {
    line: "rgb(0, 191, 255)", // deepskyblue
    square: "rgb(255, 255, 0)", // yellow
    tBlock: "rgb(218, 112, 214)", // orchid
    reverseLBlock: "rgb(65, 105, 225)", // royalblue
    lBlock: "rgb(218, 165, 32)", // goldenrod
    squiggle: "rgb(255, 0, 0)", // red
    reverseSquiggle: "rgb(50, 205, 50)" // limegreen
};
/*
This is the end of AI-generated code.
*/

//Global variables which track the game state:
let currTetromino;
let currState;
let currPosition;
let currColor;

//Global variables for game function:
let canvas;
let context;
let gridSize;
let gameBoard = [];
let speedOffset = 0;

//Global variables for the info-panel:
let nextTetromino;
let nextColor;
let numLinesCleared = 0;

/*
This is the beginning of AI-generated code from OpenAI.
This function inputs an RGB color value and outputs an RGB value with a set opacity.
*/
function shadowColor(color) {
    const [r, g, b] = color.match(/\d+/g);
    //This bit isn't AI generated. The t-block was a bit hard to see, so this should help.
    if (g == 112) {
        return `rgba(${r}, ${g}, ${b}, 0.4)`;
    }
    //This bit IS AI-generated.
    return `rgba(${r}, ${g}, ${b}, 0.3)`; // 50% opacity
}
/*
This is the end of AI-generated code.
*/


//This function takes the currState and updates it by 1, if possible.
//This results in a rotated tetronimo.
function rotateTetromino() {
    /*
    To implement this function we must
    1: Determine the resulting tetromino from the rotation
    2: Check if there is collision with the new tetromino
    3: If no collision, commit to the game board.
    */
    let nextState;
    if(currState === 3) {
        nextState = 0;
    } else {
        nextState = currState + 1;
    }
    //Since each tetromino has the same color, we find the tetromino with the same color at the next state.
    let nextTetromino = tetrominoes[Object.keys(colors).find(key => colors[key] === currColor)][nextState]

    //Check for collision from the new tetromino.
    if(checkCollisionInput(nextTetromino)) {
        return;
    } else {
        //Commit rotation
        currTetromino = nextTetromino;
        currState = nextState;

        clearBoard();
        drawTetromino();
    }

}

//This function randomly selects which tetromino will be NEXT and sets what was previously next to current.
function selectTetromino() {
    //If there is no next tetromino, select a next tetromino:
    if(!nextTetromino) {
        const tetKeys = Object.keys(tetrominoes);
        const randomKey = tetKeys[Math.floor(Math.random() * tetKeys.length)];
        nextTetromino = tetrominoes[randomKey][0];
        nextColor = colors[randomKey];
    }

    //1: Set the current tetromino to the next one
    currTetromino = nextTetromino;
    currColor = nextColor;
    currState = 0;
    currKey = Object.keys(colors).find(key => colors[key] === currColor)


    if(currKey == "square") {
        currPosition = {x: 4, y: -3};
    } else if (currKey == "tBlock") {
        currPosition = {x: 4, y: -2};
    } else {
        currPosition = {x: 3, y: -3};
    }

    //Select a tetromino from tetrominoes [Set the new NEXT]
    const tetKeys = Object.keys(tetrominoes);
    const randomKey = tetKeys[Math.floor(Math.random() * tetKeys.length)];

    nextTetromino = tetrominoes[randomKey][0];
    nextColor = colors[randomKey];

}

//This function draws the current tetromino to the screen.
function drawTetromino() {
    drawShadowTetromino();

    //Loop through each space in the currTetronimo array, then check if it's a 1.
    //If it's a 1, draw a rectangle in the corresponding position.
    for (let tetLength = 0; tetLength < currTetromino.length; tetLength++) {
        for(let tetHeight = 0; tetHeight < currTetromino[tetLength].length; tetHeight++) {
            if(currTetromino[tetLength][tetHeight] === 1) {
                //Draw the current square
                context.fillStyle = currColor;
                context.fillRect((currPosition.x + tetHeight) * gridSize, (currPosition.y + tetLength) * gridSize, gridSize, gridSize);
                context.strokeRect((currPosition.x + tetHeight) * gridSize, (currPosition.y + tetLength) * gridSize, gridSize, gridSize);
            }
        }
    }
}

//This function draws a shadow tetromino to the screen. 
//This shadow represents where the tetromino would land if hard dropped.
function drawShadowTetromino() {
    let shadowPosition = {... currPosition};
    
    //Same logic as hardDropTetromino
    while(!checkCollisionInput(currTetromino, shadowPosition)) {
        shadowPosition.y++;
    }
    shadowPosition.y--;

    //Similar logic to drawTetromino
    for (let tetLength = 0; tetLength < currTetromino.length; tetLength++) {
        for(let tetHeight = 0; tetHeight < currTetromino[tetLength].length; tetHeight++) {
            if(currTetromino[tetLength][tetHeight] === 1) {
                //Draw the current square
                context.fillStyle = shadowColor(currColor);
                context.fillRect((shadowPosition.x + tetHeight) * gridSize, (shadowPosition.y + tetLength) * gridSize, gridSize, gridSize);
                context.strokeRect((shadowPosition.x + tetHeight) * gridSize, (shadowPosition.y + tetLength) * gridSize, gridSize, gridSize);
            }
        }
    }
}

// This function controls the downward tetromino movement
function moveTetrominoDown() {
    currPosition.y++;

    //If the tetromino can't move down, we must freeze it in place
    if(checkCollision()) {
        currPosition.y--;

        for (let tetLength = 0; tetLength < currTetromino.length; tetLength++) {
            for(let tetHeight = 0; tetHeight < currTetromino[tetLength].length; tetHeight++) {
                if(currTetromino[tetLength][tetHeight] === 1) {
                    const nextX = currPosition.x + tetHeight;
                    const nextY = currPosition.y + tetLength;

                    if(nextY >= 0) {
                        gameBoard[nextY][nextX] = currColor;
                    }
                }
            }
        }

        //Check for full lines:
        clearFullLines();

        //Spawn new tetromino
        selectTetromino();

    }

    clearBoard();
    drawTetromino();
}


//This function controls left tetronimo movement.
//The active tetronimo will move LEFT when the left arrow key is pressed.
function moveTetromimoLeft() {
    currPosition.x--;

    //If there is collision, do not complete the movement
    if(checkCollision()) {
        currPosition.x++;
    }

    clearBoard();
    drawTetromino();
}

//This function controls right tetronimo movement.
//The active tetronimo will move RIGHT when the right arrow key is pressed.
function moveTetromimoRight() {
    currPosition.x++;

    //If there is collision, do not complete the movement
    if(checkCollision()) {
        currPosition.x--;
    }

    clearBoard();
    drawTetromino();
}

//This function instantly moves the tetromino as far DOWN as possible until it collides with something.
function hardDropTetromino() {
    while (!checkCollision()) {
        currPosition.y++;
    }
    currPosition.y--;

    //Copied code from moveTetrominoDown to freeze it in place
    for (let tetLength = 0; tetLength < currTetromino.length; tetLength++) {
        for(let tetHeight = 0; tetHeight < currTetromino[tetLength].length; tetHeight++) {
            if(currTetromino[tetLength][tetHeight] === 1) {
                const nextX = currPosition.x + tetHeight;
                const nextY = currPosition.y + tetLength;

                if(nextY >= 0) {
                    gameBoard[nextY][nextX] = currColor;
                }
            }
        }
    }

    clearFullLines();
    selectTetromino();
    clearBoard();
    drawTetromino();
}

// Function to clear the board
function clearBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    baseGrid();

    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 10; j++) {
            if(gameBoard[i][j]) {
                context.fillStyle = gameBoard[i][j];
                context.fillRect(j * gridSize, i * gridSize, gridSize, gridSize);
                context.strokeRect(j * gridSize, i * gridSize, gridSize, gridSize);
            }
        }
    }

    showNext();
    showScore();
}

//This function checks for any full lines and removes them.
function clearFullLines() {
    //Iterate through each row of the gameboard.
    //If a null is found at any point, then the row is NOT full and full is set to false
    //If all spaces are gone through and full is still true, the row is removed.
    for (let row = 0; row < gameBoard.length; row++) {
        let full = true;

        for (let col = 0; col < gameBoard[row].length; col++) {
            if(gameBoard[row][col] === null) {
                full = false;
                break;
            }
        }

        if (full) {
            /*
            If we're here, this row is full. We must implement this logic-
            1: Remove the current row by setting it to null
            2: Move everything above down one row starting from the bottom, working up.
            3: Set the top row to null.
            */

            // Set current row to null
            for (let col = 0; col < gameBoard[row].length; col++) {
                gameBoard[row][col] = null;
            }

            //Move everything above the cleared line down one row
            for(let upRow = row; upRow > 0; upRow--) {
                for(let col = 0; col < gameBoard[upRow].length; col++) {
                    gameBoard[upRow][col] = gameBoard[upRow - 1][col];
                }
            }

            //Set the top row to null
            for(let col = 0; col < gameBoard[0].length; col++) {
                gameBoard[0][col] = null;
            }

            numLinesCleared++;
            if(numLinesCleared % 20 === 0 && speedOffset !== 900) {
                speedOffset += 100;
            }
        }
    }
}

//This function draws the base 10x20 grid
function baseGrid() {
    context.strokeStyle = "black";
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 10; j++) {
            context.fillStyle = "rgb(150,150,150)";
            context.fillRect(j * gridSize, i * gridSize, gridSize, gridSize);
            context.strokeRect(j * gridSize, i * gridSize, gridSize, gridSize);
            console.log("baseGrid loop");
        }
    }
}

//This function checks for downward collision between the current tetronimo and other tetronimos or the bottom.
//Returns TRUE if collision is detected
//Returns FALSE if no collision is detected
function checkCollision() {
    //We need to loop through each space in the tetronimo.
    //Then we need to check if it:
    //  A: collides with any other tetronimo
    //  B: collides with the bottom of the board
    for (let tetLength = 0; tetLength < currTetromino.length; tetLength++) {
        for(let tetHeight = 0; tetHeight < currTetromino[tetLength].length; tetHeight++) {
            if(currTetromino[tetLength][tetHeight] === 1) {
                const nextX = currPosition.x + tetHeight;
                const nextY = currPosition.y + tetLength;

                //Bottom of screen check
                if (nextY >= 20) {
                    return true;
                }

                //Check left/right collision
                if(nextX < 0 || nextX >= 10) {
                    return true;
                }

                //Tetromino check
                if (nextY >= 0 && gameBoard[nextY][nextX]) {
                    return true;
                }
            }
        }
    }

    return false;
}

//This function checks for downward collision between the INPUTTED TETROMINO and other tetronimos or the bottom.
//This can also take a custom position if desired.
//Returns TRUE if collision is detected
//Returns FALSE if no collision is detected
function checkCollisionInput(tetronimo, position = currPosition) {
    //We need to loop through each space in the tetronimo.
    //Then we need to check if it:
    //  A: collides with any other tetronimo
    //  B: collides with the bottom of the board
    for (let tetLength = 0; tetLength < tetronimo.length; tetLength++) {
        for(let tetHeight = 0; tetHeight < tetronimo[tetLength].length; tetHeight++) {
            if(tetronimo[tetLength][tetHeight] === 1) {
                const nextX = position.x + tetHeight;
                const nextY = position.y + tetLength;

                //Bottom of screen check
                if (nextY >= 20) {
                    return true;
                }

                //Check left/right collision
                if(nextX < 0 || nextX >= 10) {
                    return true;
                }

                //Tetromino check
                if (nextY >= 0 && gameBoard[nextY][nextX]) {
                    return true;
                }
            }
        }
    }

    return false;
}


//This function shows the next tetromino in a box on the bottom-right side of the screen
//This is set up to be as dynamic as possible to accommodate for varying screen sizes
function showNext() {
    const infoPanelX = canvas.width * (2 / 3); // Start position of the info panel (right third)
    const infoPanelWidth = canvas.width / 3;  // Width of the info panel
    const gridSize = canvas.width / 30; // Smaller grid size for next tetromino display

    // Calculate the box dimensions
    const nextBoxWidth = infoPanelWidth - gridSize * 2; // Almost a third of the canvas size
    const nextBoxHeight = gridSize * 3; // Exactly gridSize * 3

    // Vertical positioning dynamically using gridSize
    const offsetX = infoPanelX + (infoPanelWidth - nextBoxWidth) / 2; // Centering the next tetromino
    const offsetY = canvas.height - nextBoxHeight - gridSize * 2; // Position above the bottom with a margin

    // Calculate dynamic text size based on the canvas size
    const textSize = Math.floor(canvas.width / 30);
    context.font = `${textSize}px 'Press Start 2P', sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Save the current line width
    const originalLineWidth = context.lineWidth;

    // Draw the black border around the next area with a thicker border
    context.strokeStyle = "black";
    context.lineWidth = 4; // Thicker border
    context.strokeRect(offsetX, offsetY - gridSize - 20, nextBoxWidth, nextBoxHeight + gridSize + 20);

    // Restore the original line width
    context.lineWidth = originalLineWidth;

    // Draw the text "NEXT" in the 8-bit style font and center it over the box
    context.fillStyle = "black";
    const textX = offsetX + nextBoxWidth / 2;
    const textY = offsetY - gridSize - 5; // Move the text further down
    context.fillText("NEXT", textX, textY);

    // Draw the next tetromino
    const tetrominoWidth = nextTetromino[0].length;
    const tetrominoHeight = nextTetromino.length;
    const tetrominoOffsetX = offsetX + (nextBoxWidth - tetrominoWidth * gridSize) / 2;
    const tetrominoOffsetY = offsetY + (nextBoxHeight - tetrominoHeight * gridSize) / 2 - gridSize / 3; // Adjust to prevent intersection with bottom

    for (let tetLength = 0; tetLength < nextTetromino.length; tetLength++) {
        for (let tetHeight = 0; tetHeight < nextTetromino[tetLength].length; tetHeight++) {
            if (nextTetromino[tetLength][tetHeight] === 1) {
                context.fillStyle = nextColor;
                context.fillRect(tetrominoOffsetX + tetHeight * gridSize, tetrominoOffsetY + tetLength * gridSize, gridSize, gridSize);
                context.strokeRect(tetrominoOffsetX + tetHeight * gridSize, tetrominoOffsetY + tetLength * gridSize, gridSize, gridSize);
            }
        }
    }
}


// This function shows the current score (number of lines cleared) in a box on the top-right side of the screen
// This is set up to be as dynamic as possible to accommodate for varying screen sizes
function showScore() {
    const infoPanelX = canvas.width * (2 / 3); // Start position of the info panel (right third)
    const infoPanelWidth = canvas.width / 3;  // Width of the info panel
    const gridSize = canvas.width / 30; // Smaller grid size for score display

    // Calculate the box dimensions
    const scoreBoxWidth = infoPanelWidth - gridSize * 2; // Almost a third of the canvas size
    const scoreBoxHeight = gridSize * 3; // Exactly gridSize * 3

    // Vertical positioning dynamically using gridSize
    const offsetX = infoPanelX + (infoPanelWidth - scoreBoxWidth) / 2; // Centering the score display
    const offsetY = gridSize * 2; // Start one gridSize below the top of the canvas

    // Calculate dynamic text size based on the canvas size
    const textSize = Math.floor(canvas.width / 30);
    context.font = `${textSize}px 'Press Start 2P', sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Save the current line width
    const originalLineWidth = context.lineWidth;

    // Draw the black border around the score area with a thicker border
    context.strokeStyle = "black";
    context.lineWidth = 4; // Thicker border
    context.strokeRect(offsetX, offsetY, scoreBoxWidth, scoreBoxHeight + gridSize + 20);

    // Restore the original line width
    context.lineWidth = originalLineWidth;

    // Draw the text "SCORE" in the 8-bit style font and center it inside the box
    context.fillStyle = "black";
    const textX = offsetX + scoreBoxWidth / 2;
    const textY = offsetY + gridSize; // Move the "SCORE" header further downward
    context.fillText("SCORE", textX, textY);

    // Draw the current score
    context.fillStyle = "black";
    const score = numLinesCleared.toString().padStart(4, '0'); // Pad score to 4 digits
    const scoreX = offsetX + scoreBoxWidth / 2;
    const scoreY = offsetY + gridSize * 2.5; // Adjust position of the score text to be inside the box
    context.fillText(score, scoreX, scoreY);
}


//Code inside this block runs when a key is pressed.
//A switch statement is used to determine which key is being pressed.

/*
I don't want to add comments to each use of "event.preventDefault()", so consider this block for all uses of that line

All uses of event.preventDefault() are AI-Generated from OpenAI.
That function disables the default functionality of the keys used in the function.
For this specific case, it disables the scrolling of the page via the arrow keys.
*/
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowLeft":
            event.preventDefault();
            moveTetromimoLeft();
            break;
        case "ArrowRight":
            event.preventDefault();
            moveTetromimoRight();
            break;
        case "ArrowDown":
            event.preventDefault();
            moveTetrominoDown();
            break;
        case "ArrowUp":
            event.preventDefault();
            rotateTetromino();
            break;
        case " ":
            event.preventDefault();
            hardDropTetromino();
            break;
        default:
            break;
    }
})


//Code inside this JS block begins running once HTML elements have been loaded onto the page.
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("Page loaded");

    //Set up the canvas object
    //We use the CanvasRenderingObject2d interface which allows me to draw rectangles and use similar functions
    canvas = document.getElementById("tetrisGame");
    context = canvas.getContext("2d");

    /*
    THIS HAS BEEN CHANGED. REFER TO BELOW
    
    //Game will be sized to the center third. Width is a third of the screen. Height is width*1.33
    const screenWidth = window.innerWidth;
    const gameWidth = screenWidth * (1/3);
    canvas.width = gameWidth;
    canvas.height = gameWidth*(4/3);
    */

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    //Canvas size will be set by the following parameters:
    //Width = Height * (3/4)
    //Height = screenHeight * 90%
    canvas.height = screenHeight * 0.8;
    gameWidth = (screenHeight * 0.8) * (3/4);
    canvas.width = gameWidth;


    //Set up the grid
    //The standard tetris grid is 10x20.

    //gridSize = the size of one side of a grid square
    //           this is computed with 2/3 the canvas size divided by 10.
    gridSize = (gameWidth*(2/3))/10

    //gameBoard is a 10x20 2D array representing the game state.
    
    //original implementation- updated:
    // If a space is a 0, the space is EMPTY
    //If a space is a 1, the space is FULL

    //The gameBoard will be filled with color data.
    //If a space is NULL, the space is EMPTY
    //If a space has a color, the space is FULL
    //The board will be initialized to all zeroes.
    for (let i = 0; i < 20; i++) {
        gameBoard[i] = [];
        for(let j = 0; j < 10; j++) {
            gameBoard[i][j] = null;
        }
    }

    function mainLoop() {
        baseGrid();

        moveTetrominoDown();
        
        //setTimeout controls the game speed. Lower numbers mean faster speed.
        //The game gets faster for every twenty lines cleared.
        setTimeout(mainLoop, (1000 - speedOffset));
    }

    selectTetromino();
    baseGrid();
    drawTetromino();
    mainLoop();
});