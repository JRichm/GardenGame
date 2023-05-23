import { Game } from './game.mjs'


// ####       document selectors        #### ///
// game
let gameSquares = document.getElementsByClassName('click-div');
// shop
let shopItems = document.getElementsByClassName('shop-item');



// ####           START GAME            #### ///

// instantiate new game
const newGame = new Game();


// shop buttons event listeners
for (let sb = 0; sb < shopItems.length; sb++) {
    shopItems[sb].addEventListener('click', e => newGame.updateUserSelection(e))
    shopItems[sb].addEventListener('mouseenter', e => newGame.showShopItemStats(e))
    shopItems[sb].addEventListener('mouseout', e => newGame.showShopItemPrice(e))
}

// game square event listeners
for (let sq = 0; sq < gameSquares.length; sq++) {
    gameSquares[sq].addEventListener('click', e => newGame.userClickGameSquare(e))
    gameSquares[sq].addEventListener('contextmenu', e => newGame.userRightClickGameSquare(e), false)
    gameSquares[sq].addEventListener('mouseenter', e => newGame.userHoverGameSquare(e))
}
