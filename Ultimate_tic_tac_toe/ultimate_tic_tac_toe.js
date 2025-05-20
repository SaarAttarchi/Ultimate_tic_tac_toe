const numOfBoards = 9;
const cells = document.querySelectorAll('.cell');
const playableBoards = [];
const playerTurn = document.getElementById("status");
const showBoard = document.getElementById(`showBoard`);
const X = document.getElementById("X").outerHTML;
const O = document.getElementById("O").outerHTML;

let currentPlayer = X;
let playableSector = 10;
let winner = false;


const winningCombos = [
    [0, 1, 2], // Rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonal
    [2, 4, 6],
];

for (let i = 0; i < numOfBoards; i++) {
    playableBoards[i] = true;
    
}



game();

// game starts
function game() {
    // highlight the enire board background for the first placement
    for (let i = 0; i < numOfBoards; i++) {
        if(playableBoards[i])
            setHighlight(i, "add");
    }
    playerTurn.innerHTML = `<span class="${currentPlayer === X ? 'player-X' : 'player-O'}">${currentPlayer} turn</span>`;
    
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            // Check if the cell is already filled
            if (cell.textContent !== '') {
                return; // Cell already filled, do nothing
            }


            let cellId = cell.id;
            let cellX = cellId.slice(cellId.indexOf("_") - 1, cellId.indexOf("_")); // saves the number of sector
            
            // if we are in the correct sector and nobody won it and we are not in the results board
            if (cellX == playableSector && playableBoards[playableSector] && cell.id.slice(0 , 1) !== 'r') {

                // Place the current player's mark
                cell.innerHTML = currentPlayer;
                
                // remove current highlighted background
                setHighlight(playableSector, "remove");

                let cellY = cell.id.slice(-1);
                playableSector = cellY;

                // check for the winner
                checkWin(currentPlayer, cellX);
                
                // sets the new playable background and highliting the sector
                if (playableBoards[playableSector]) {
                    console.log("new playable sector is: " + playableSector);
                    setHighlight(playableSector, "add");
                }
                else{
                    for (let i = 0; i < numOfBoards; i++) {
                        if(playableBoards[i])
                            setHighlight(i, "add");
                    }
                }

                // continue if the game didn't end
                if (!winner) {
                    // Alternate the player
                    currentPlayer = currentPlayer === X ? O : X;
                    playerTurn.innerHTML = `<span class="${currentPlayer === X ? 'player-X' : 'player-O'}">${currentPlayer} turn</span>`;
                }
            }
            // if the turn is on a sector already won and we are not in the results board
            else if(!playableBoards[playableSector] && cell.id.slice(0, 1) !== 'r'){

                // Place the current player's mark
                cell.innerHTML = currentPlayer;

                // remove current highlighted background
                for (let i = 0; i < numOfBoards; i++) {
                    if(playableBoards[i])
                        setHighlight(i, "remove");
                }
                let cellY = cell.id.slice(-1);
                playableSector = cellY;
                
                // check for the winner
                if (playableBoards[cellX]) {
                    checkWin(currentPlayer, cellX);
                }

                // sets the new playable background and highliting the sector
                if (playableBoards[playableSector]) {
                    console.log("new playable sector is: " + playableSector);
                    setHighlight(playableSector, "add");
                }
                else {
                    for (let i = 0; i < numOfBoards; i++) {
                        if (playableBoards[i])
                            setHighlight(i, "add");
                    }
                }
                
                // continue if the game didn't end
                if (!winner) {
                    // Alternate the player
                    currentPlayer = currentPlayer === X ? O : X;
                    playerTurn.innerHTML = `<span class="${currentPlayer === X ? 'player-X' : 'player-O'}">${currentPlayer} turn</span>`;
                }
            }
            else{
                return;
            }
        });
    });

}

function setHighlight(playableSector, action){
    // add or remove background highlighting
    if (action == "add") {
        for (let i = 0; i < 9; i++) {
            document.getElementById(`cell${playableSector}_${i}`).classList.add(`highlight`);
        }
    }

    if (action == "remove") {
        for (let i = 0; i < 9; i++) {
            document.getElementById(`cell${playableSector}_${i}`).classList.remove(`highlight`);
        }
    }

}

function checkWin(sign, cellX){

    sign = currentPlayer === X ? 'X' : 'O';
    console.log(sign);
    let valueInSector;

    let locationsInSector = [];
    // save all the values in the sector
    for (let i = 0; i < 9; i++) {
        valueInSector = document.getElementById(`cell${cellX}_${i}`).textContent;
        locationsInSector[i] = valueInSector;

        console.log(locationsInSector[i]);
  
    }
    console.log(locationsInSector); 
    // check for each combo if it looks like the values in the sector
    for (let i = 0; i < winningCombos.length; i++) {
        if(sign == locationsInSector[winningCombos[i][0]] && sign == locationsInSector[winningCombos[i][1]] && sign == locationsInSector[winningCombos[i][2]] )  {
            console.log(`${sign} won board ${cellX}`);
            playableBoards[cellX] = false;
            for (let i = 0; i < 9; i++) {
                document.getElementById(`cell${cellX}_${i}`).classList.add(`winner-${sign}`);
            }
            showBoardPoint(sign, cellX);// updates th showBoard

        } 
    }

}

function showBoardPoint(sign, cellX){
    // set the winner of the sector to have this board cell
    let showBoardCell = document.getElementById(`resultsCell${cellX}`);
    showBoardCell.classList.add(`winner-${sign}`);
    showBoardCell.innerHTML = currentPlayer;
    console.log(currentPlayer);

    let locationsInShow = [];
    // save all the values in the sector
    for (let i = 0; i < numOfBoards; i++) {
        let valueInShow = document.getElementById(`resultsCell${i}`).textContent;
        locationsInShow[i] = valueInShow; 
    }
    console.log(locationsInShow);
    
     // check for each combo if it looks like the values in the sector
     for (let i = 0; i < winningCombos.length; i++) {
        if(sign == locationsInShow[winningCombos[i][0]] && sign == locationsInShow[winningCombos[i][1]] && sign == locationsInShow[winningCombos[i][2]] )  {
            console.log(`${sign} won the game!!!`);
            winner = true;
            // set the entire board in the winners colors
            for (let i = 0; i < numOfBoards; i++) {
                for (let j = 0; j < 9; j++) { // remove all the exisiting ones
                    document.getElementById(`cell${i}_${j}`).classList.remove(`winner-X`, `winner-O`);
                }
            }
            for (let i = 0; i < numOfBoards; i++) {
                for (let j = 0; j < 9; j++) {
                    document.getElementById(`cell${i}_${j}`).classList.add(`winner-${sign}`); 
                }
            }
            playerTurn.innerHTML = `<span class="${currentPlayer === X ? 'player-X-won' : 'player-O-won'}">${currentPlayer === X ? 'X': 'O'} has won the game! </span>`; 
        }
    }


    

    

}

