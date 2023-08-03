const gLevel = {
    
    SIZE: 4,
    MINES: 2
};
const gLevel2 = {
    SIZE: 8,
    MINES: 14
}
const gLevel3 = {
    SIZE:12,
    MINES: 32 

}

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

const gBoard = [];

 function onInit() { 
    
    createBoard();
    renderBoard();
}
function startGame(level) {
    gGame.isOn = false;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gLevel.SIZE = level.SIZE;
    gLevel.MINES = level.MINES;
    gBoard.length = 0;
    createBoard();
    renderBoard();
    const numberOfBombsElement = document.getElementById("numberOfBombs");
    numberOfBombsElement.textContent = `💣${gLevel.MINES}`;
    
}
function createBoard() {
    const size =  gLevel.SIZE;
    const mines = gLevel.MINES
    const numbers = []
    for (let i = 1; i <= size * size; i++) {
        numbers.push(i);
      }

    
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            const cell = {
                row: i,
                col: j,
                isOpen: false,
                isMine: false,
                isMarked: false,
                minesAroundCount: 0,
            };
            row.push(cell);
        }
        gBoard.push(row);
    }

    placeMines(mines);
    setMinesNegsCount();
    const numberOfBombsElement = document.getElementById("numberOfBombs");
    numberOfBombsElement.textContent = `💣${gLevel.MINES}`;
}
function renderBoard() {
    let strHTML = '';
    let openedCells = 0;
    let totalCells = gLevel.SIZE * gLevel.SIZE;

    for (let i = 0; i < gLevel.SIZE; i++) {
        strHTML += `<tr>\n`;
        for (let j = 0; j < gLevel.SIZE; j++) {
            const cell = gBoard[i][j];
            const className = cell.isMine ? 'mine' : `cell-${i}-${j}` + (cell.isOpen ? ' opened-cell' : '');
            const content = cell.isMine ? "💣" : cell.minesAroundCount || "" 
            const title = `Cell: ${i + 1}, ${j + 1}`;
            const isOpen = cell.isOpen ? 'block' : 'none'
            if (cell.isOpen) {
                openedCells++;
            }

            
            strHTML += `\t<td title="${title}" class="${className}" onclick="onCellClicked(this, ${i}, ${j})">
                        <div  style="display: ${isOpen}">${content}</div>
                        </td>\n`;
        }
       
        strHTML += `</tr>\n`;
    }

   
    const board = document.getElementById("board");
    board.innerHTML = strHTML;

    if (openedCells === totalCells - gLevel.MINES) {
        alert("Congratulations!!");
    }
    
}
function onCellClicked(td, i, j) {
    const cell = gBoard[i][j];
    cell.isOpen = true
    
    if(cell.isMine){
        alert("lossssss")
        window.location.reload()
    }else if (cell.minesAroundCount === 0) { 
        expandEmptyCells(i, j)
    }
    renderBoard()
}
function onCellMarked(elCell){

}
function expandEmptyCells(row, col) {
const size = gLevel.SIZE;
const rowStart = Math.max(0, row - 1);
const rowEnd = Math.min(size - 1, row + 1);
    const colStart = Math.max(0, col - 1);
    const colEnd = Math.min(size - 1, col + 1);

    for (let i = rowStart; i <= rowEnd; i++) {
        for (let j = colStart; j <= colEnd; j++) {
            const cell = gBoard[i][j];
            if (!cell.isOpen && !cell.isMine) {
                cell.isOpen = true;
                if (cell.minesAroundCount === 0) {
                    
                    expandEmptyCells(i, j);
                }
            }
        }
    }
}
function placeMines(mines) {
    const size = gLevel.SIZE;
    const boardSize = size * size;
    let count = 0;
    
    while (count < mines) {
        const randomIndex = Math.floor(Math.random() * boardSize);
        const row = Math.floor(randomIndex / size);
        const col = randomIndex % size;

        if (!gBoard[row][col].isMine) {
            gBoard[row][col].isMine = true;
            count++;
        }
    }
}
function setMinesNegsCount() {
    for (let i = 0; i < gLevel.SIZE; i++) {
        for (let j = 0; j < gLevel.SIZE; j++) {
            const cell = gBoard[i][j];
            if (!cell.isMine) {
                cell.minesAroundCount = countMinesAround(cell);
            }
        }
    }
}
function countMinesAround(cell) {
    let count = 0;
    const size = gLevel.SIZE;
    const rowStart = Math.max(0, cell.row - 1);
    const rowEnd = Math.min(size - 1, cell.row + 1);
    const colStart = Math.max(0, cell.col - 1);
    const colEnd = Math.min(size - 1, cell.col + 1);

    for (let i = rowStart; i <= rowEnd; i++) {
        for (let j = colStart; j <= colEnd; j++) {
            if (gBoard[i][j].isMine) {
                count++;
            }
        }
    }

    return count;
}
function reload(){
    window.location.reload();
}
