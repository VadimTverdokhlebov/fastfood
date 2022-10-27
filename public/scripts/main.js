"use strict";

const menuModalCategorylId = ["sizes", "breads", "vegetables", "sauces", "fillings", "sandwichDone"];
const basket = [];
let customSandwich = {};
let indexMenuModal = 0;
let previousElementModalMenu = "sizes";

selectedProductCategory();
showBasket();

async function getMenuProduct() {

    const url = 'http://localhost:8080/api';
    const response = await fetch(url);
    const result = await response.json();
    const menu = result.menu;

    return menu;
}

async function getElementProduct(id) {

    const url = 'http://localhost:8080/api';
    const response = await fetch(url);
    const result = await response.json();
    for (let key in result) {
        if (key === id) {
            return result[key]
        }
    }
}

function selectedProductCategory() {

    let categoriesMenu = document.querySelectorAll('.categoryMenu');
    let defaultCategoryId = "pizza";
    for (let category of categoriesMenu) {
        category.addEventListener('click', function () {
            showProducts(category.id);
        })
    }

    showProducts(defaultCategoryId);
}

async function showProducts(categoryId) {

    content.remove();

    let menu = await getMenuProduct();
    let div = document.createElement('div');

    div.id = "content";
    sidebar.after(div);

    for (let key in menu) {
        if (menu[key].category == categoryId) {
            content.insertAdjacentHTML("afterbegin", /*html*/
                `<div class="product">
                <img class="foodLogo" src="i/markets/subway_logo.png">
                <img class="foodPicture" src="${menu[key].image}">

                <div class="foodName">${menu[key].name}</div>

                <div class="foodLine">
                    <p class="foodStructure">${menu[key].description}</p>
                </div>

                <p class="foodPrice">Цена: ${menu[key].price} руб.</p>
                <p class="foodCount">КОЛИЧЕСТВО</p>

                <form class="formAddBasket" id="addBasket" method="POST">
                    <div class="foodCounter">
                        <button type="button" onclick="this.nextElementSibling.stepDown()">
                            <img alt="minus" src="i/minus.png" class="buttonMinus"/>
                        </button>

                        <input class="quantity" id="quantity${menu[key].id}" type="number" min="1" max="20" value="1" readonly>

                        <button type="button" onclick="this.previousElementSibling.stepUp()">
                            <img alt="plus" src="i/plus.png" class="buttonPlus"/>
                        </button>
                    </div>
                    <input class="buttonBuy" type="button" value = "В КОРЗИНУ" 
                        onclick = "addProductInBasket(${menu[key].id}, ${menu[key].category}, getQuantityProduct('quantity${menu[key].id}'))">
                </form>

            </div>`);
        }
    }
}

function showBasket() {

    showProductFromBasket();
    showSumOrder();
}

function showSumOrder() {

    basketTotal.remove();

    let sum = getSumOrder();
    let div = document.createElement('div');

    div.id = "basketTotal";
    basketOrder.prepend(div);

    basketTotal.insertAdjacentHTML("afterbegin", /*html*/ `<p> Итого: ${sum} руб. </p>`);
}

function showProductFromBasket() {

    basketContainer.remove();

    let div = document.createElement('div');

    div.id = "basketContainer";
    basketTitle.after(div);

    for (let key in basket) {
        basketContainer.insertAdjacentHTML("afterbegin", /*html*/`
        <div class="basketProduct" id="positionProductInBasket${basket[key].id}">

            <button type="button" id="idProductInBasket${basket[key].id}" onclick="removeProductInBasket(${basket[key].id})">
                <img src="i/vcsconflicting_93497.png" class="buttonDelete"/>
            </button>
            
            <p>${basket[key].name}</p>
            
            <button type="button" onclick="setQuantityProductInBasket(${basket[key].id}, -1)">
                <img alt="minus" src="i/minus.png" class="buttonMinus"/>
            </button>

                <input class="quantity" type="number" min="1" max="20" value="${basket[key].quantity}" readonly>

            <button type="button" onclick="setQuantityProductInBasket(${basket[key].id}, 1)">
                <img alt="plus" src="i/plus.png" class="buttonPlus"/>
            </button>

        </div>
        `);
    }
}

function setQuantityProductInBasket(id, step) {
    const product = basket.find((product) => product.id === id);

    if (!product) {
        return;
    }
    product.quantity += Number(step);
    if (product.quantity <= 0) {
        removeProductInBasket(id);
    }

    showBasket();

}

function removeProductInBasket(id) {
    for (let key in basket) {
        if (basket[key].id === id) {
            let index = basket.indexOf(basket[key]);
            if (index > -1) {
                basket.splice(index, 1);
                showBasket();
            }
        }
    }
}

function getQuantityProduct(id) {
    let quantity = document.getElementById(id).value;
    return quantity;
}

async function getElementMenuProduct(id, quantity) {
    let menu = await getMenuProduct();
    for (let key in menu) {
        if (menu[key].id === id) {
            let result = menu[key];
            result.quantity = Number(quantity);
            return result;
        }
    }
}

function checkProductInBasket(id) {
    if (basket.length > 0) {
        for (let key in basket) {
            if (basket[key].id === id) {
                return true;
            }
        }
    }
    return false;
}

function addQuantityProductInBasket(id, quantity) {
    for (let key in basket) {
        if (basket[key].id === id) {
            basket[key].quantity += Number(quantity);
            showBasket();
            break;
        }
    }
}

async function addProductInBasket(id, category, quantity) {

    let product = await getElementMenuProduct(id, quantity);
    let productInBasket = checkProductInBasket(id);

    if (category.id == 'sandwiches') {
        customSandwich = product;
        showModalCreateSandwich();
    }
    else if (productInBasket == true) {

        addQuantityProductInBasket(id, quantity);
        showBasket();

    } else {

        basket.push(product);
        showBasket();
    }
}

function getSumOrder() {
    let sum = 0;
    if (basket.length > 0) {
        for (let key in basket) {
            sum += basket[key].quantity * basket[key].price;
        }
    }
    return sum;
}

function showModalCreateSandwich() {

    let div = document.createElement('div');
    const defultProductMenuId = "sizes";

    div.id = "modalWindow";

    content.after(div);

    modalWindow.insertAdjacentHTML("afterbegin", /*html*/`
    <div class="modalOverlay" id="modalOverlay"></div>
        <div class="modalContainer">
            <div class="modalContent">
                <button class="closeButton" onclick="removeModalCreateSandwich()">X</button>
                <button id="backButton" onclick="manageModalButton (-1)">Назад</button>
                <button id="forwardButton" onclick="manageModalButton (1)">Вперед</button>
                <ul id="menuModal">
                    <li onclick="showProductMenuModal(this.id)" class="categoryMenuModal" id="sizes"><a>Размер</a></li>
                    <li onclick="showProductMenuModal(this.id)" class="categoryMenuModal" id="breads"><a>Хлеб</a></li>
                    <li onclick="showProductMenuModal(this.id)" class="categoryMenuModal" id="vegetables"><a>Овощи</a></li>
                    <li onclick="showProductMenuModal(this.id)" class="categoryMenuModal" id="sauces"><a>Соусы</a></li>
                    <li onclick="showProductMenuModal(this.id)" class="categoryMenuModal" id="fillings"><a>Начинка</a></li>
                    <li onclick="showSandwichDone()" id="sandwichDone">Готово</li>
                </ul>
                <div id="productContainer"></div>
            </div>
        </div>
    `);

    showProductMenuModal(defultProductMenuId);

}

function manageModalButton(step) {

    if (indexMenuModal + step <= 0) {
        indexMenuModal = 0;

    } else if (indexMenuModal + step >= 5) {
        indexMenuModal = 5;

    } else {
        indexMenuModal += step;
    }

    if (menuModalCategorylId[indexMenuModal] == "sandwichDone") {
        showSandwichDone();

    } else {
        showProductMenuModal(menuModalCategorylId[indexMenuModal]);
    }
}

function showModalButton() {

    if (indexMenuModal == 0) {
        document.getElementById('backButton').style.visibility = 'hidden';
        document.getElementById('forwardButton').style.visibility = 'visible';
    } else if (indexMenuModal == 5) {
        document.getElementById('forwardButton').style.visibility = 'hidden';
        document.getElementById('backButton').style.visibility = 'visible';
    } else {
        document.getElementById('backButton').style.visibility = 'visible';
        document.getElementById('forwardButton').style.visibility = 'visible';
    }
}

function showSandwichDone() {

    productContainer.remove();
    indexMenuModal = menuModalCategorylId.findIndex(category => category === "sandwichDone");

    let div = document.createElement('div');

    div.id = "productContainer";

    menuModal.after(div);

    productContainer.insertAdjacentHTML("afterbegin", /*html*/`
        <div>
        <img src="${customSandwich.image}">

        <div>${customSandwich.name}</div>

        <p>Цена: ${customSandwich.price} руб.</p>

    </div>
    `);
    showModalButton();
    document.getElementById('sandwichDone').style.background = 'rgb(235, 74, 52)';
    document.getElementById(previousElementModalMenu).style.background = 'white';
    
    previousElementModalMenu = 'sandwichDone';
}

async function showProductMenuModal(categoryId) {

    productContainer.remove();

    indexMenuModal = menuModalCategorylId.findIndex(category => category === categoryId);

    let products = await getElementProduct(categoryId);
    let div = document.createElement('div');

    div.id = "productContainer";

    menuModal.after(div);

    for (let key in products) {
        productContainer.insertAdjacentHTML("afterbegin", /*html*/`
        <div class="modalProductCard">
        <img src="${products[key].image}">

        <div>${products[key].name}</div>

        <p>Цена: ${products[key].price} руб.</p>

    </div>
    `);
    }
    showModalButton();
    document.getElementById(previousElementModalMenu).style.background = 'white';
    document.getElementById(categoryId).style.background = 'rgb(235, 74, 52)';
    
    previousElementModalMenu = categoryId;
}

function removeModalCreateSandwich() {
    modalWindow.remove();
}

