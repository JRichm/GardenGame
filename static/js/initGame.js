let x = 0;
let y = 0;

gameSquares = document.getElementsByClassName('game-square');

for (each in gameSquares) {
    gameSquares[each].id = `${x}${y}`
    x++;
    if (x >= 9) {
        x = 0;
        y++
    }
    console.log(gameSquares[each]);
    gameSquares[each].addEventListener('click', e => gameSquareClick(e))
}


function gameSquareClick(event) {
    if (event.target.className = 'game-char') {
        console.log(event.target.parent)
    } else {
        console.log(event.target)
    }
}