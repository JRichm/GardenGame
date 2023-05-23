
// ####       front end functions       #### ///

// plant/upgrades tab buttons
let plantsOpen = true;

let currentPage = 1;
let plantsTab = document.getElementById('plants-tab');
let upgradesTab = document.getElementById('upgrades-tab');

plantsTab.addEventListener('click', e => {
    let pages = document.getElementById('shop-pages').children;
    for (let p = 0; p < pages.length; p++) {
        pages[p].classList.add('hidden')
    }
    document.getElementById('shop-1').classList.remove('hidden')
    currentPage = 1;
    plantsOpen = true
})

upgradesTab.addEventListener('click', e => {
    let pages = document.getElementById('shop-pages').children;
    for (let p = 0; p < pages.length; p++) {
        pages[p].classList.add('hidden')
    }
    document.getElementById('upgrades-1').classList.remove('hidden')
    currentPage = 1;
    plantsOpen = false
})

// shop items selection
const shopItems = document.querySelectorAll('.shop-item');
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


// left-right shop buttons
let shopNext = document.getElementById('next-shop')
let shopPrev = document.getElementById('prev-shop')
shopNext.addEventListener('click', e => updateShop(1));
shopPrev.addEventListener('click', e => updateShop(-1));

function updateShop(amount) {

    if (plantsOpen) {
        // dont switch to a page that doesn't exist
        if (currentPage + amount > 0 && currentPage + amount < 5) {
            document.getElementById(`shop-${currentPage}`).classList.add('hidden')
            currentPage += amount;
            document.getElementById(`shop-${currentPage}`).classList.remove('hidden')
        }

    } else {
        console.log(currentPage + amount)
        // dont switch to a page that doesn't exist
        if (currentPage + amount > 0 && currentPage + amount < 3) {
            document.getElementById(`upgrades-${currentPage}`).classList.add('hidden')
            currentPage += amount;
            document.getElementById(`upgrades-${currentPage}`).classList.remove('hidden')
        }
    }
}