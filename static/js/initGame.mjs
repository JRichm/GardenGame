import { Game } from './game.mjs'


// ####       document selectors        #### ///
// game
let gameSquares = document.getElementsByClassName('click-div');
// shop
let shopItems = document.getElementsByClassName('shop-item-info');


// ####           START GAME            #### ///

// instantiate new game
const newGame = new Game();


// shop buttons event listeners
for (let j = 0; j < shopItems.length; j++) {
    shopItems[j].addEventListener('click', e => newGame.updateUserSelection(e))
}

// game square event listeners
for (let sq = 0; sq < gameSquares.length; sq++) {
    gameSquares[sq].addEventListener('click', e => newGame.userClickGameSquare(e))
    gameSquares[sq].addEventListener('contextmenu', e => newGame.userRightClickGameSquare(e), false)
    gameSquares[sq].addEventListener('mouseenter', e => newGame.userHoverGameSquare(e))
}
