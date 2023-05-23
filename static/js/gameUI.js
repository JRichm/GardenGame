
// ####       front end functions       #### ///

// left-right shop buttons
let currentPage = 1;
let shopNext = document.getElementById('next-shop')
let shopPrev = document.getElementById('prev-shop')
shopNext.addEventListener('click', e => updateShop(1));
shopPrev.addEventListener('click', e => updateShop(-1));

function updateShop(amount) {

    // dont switch to a page that doesn't exist
    if (currentPage + amount > 0 && currentPage + amount < 5) {
        document.getElementById(`shop-${currentPage}`).classList.add('hidden')
        currentPage += amount;
        document.getElementById(`shop-${currentPage}`).classList.remove('hidden')
    }
}


// shop items selection
const shopItems = document.querySelectorAll('.shop-item-info');
let selectedShopItem = null;

shopItems.forEach(item => {
    item.addEventListener('click', highlightSelection);
});

function highlightSelection(event) {
    if (selectedShopItem !== null) {
        selectedShopItem.style.backgroundColor = '#eeeeee';
    }

    if (selectedShopItem === event.currentTarget) {
        event.currentTarget.style.backgroundColor = '#eeeeee';
        selectedShopItem = null;
    }

    event.currentTarget.style.backgroundColor = '#dddddd';
    selectedShopItem = event.currentTarget;
}