"use strict";

const menuModalCategorylId = ["size", "bread", "vegetable", "sauce", "filling", "sandwichDone"];
const basket = [];
let componentsCustomSandwich = new Map();
let customSandwich = {};
let indexMenuModal = 0;
let previousElementModalMenu = "size";
let comps = {
    size: "Размер",
    bread: "Хлеб",
    vegetable: "Овощи",
    sauce: "Соус",
    filling: "Начинка",
};

selectedProductCategory();
showBasket();

async function getJson() {
    const url = 'http://localhost:8080/api';
    const response = await fetch(url);
    const result = await response.json();

    return result;
}

async function getMenuProduct() {
    const result = await getJson();

    return result.menu;
}

async function getElementProduct(idCategory) {
    const result = await getJson();

    for (let key in result) {
        if (key === idCategory) {
            return result[key];
        }
    }
}

async function getElementCustomSandwich(keyProduct) {
    const result = await getJson();

    let map = new Map();
    let categoryMap = new Map();

    for (let keyCategory in result) {
        for (let key in result[keyCategory]) {

            if (key === keyProduct) {

                map.set(keyProduct, result[keyCategory][key]);
                let product = Object.fromEntries(map.entries());

                categoryMap.set(keyCategory, product);
                let productCategory = Object.fromEntries(categoryMap.entries());

                return productCategory;
            }
        }
    }
}

function selectedProductCategory() {

    let categoriesMenu = document.querySelectorAll('.categoryMenu');
    let defaultCategoryId = "sandwiches";
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
                <img class="foodLogo" src="images/markets/subway_logo.png">
                
                    <img class="foodPicture"src="${menu[key].image}">
                
                <div class="foodName">${menu[key].name}</div>

                <div class="foodLine">
                    <p class="foodStructure">${menu[key].description}</p>
                </div>

                <p class="foodPrice">Цена: ${menu[key].price} руб.</p>
                <p class="foodCount">КОЛИЧЕСТВО</p>

                <form class="formAddBasket" id="addBasket" method="POST">
                    <div class="foodCounter">
                        <button type="button" onclick="this.nextElementSibling.stepDown()">
                            <img alt="minus" src="images/minus.png" class="buttonMinus"/>
                        </button>

                        <input class="quantity" id="quantity${menu[key].id}" type="number" min="1" max="20" value="1" readonly>

                        <button type="button" onclick="this.previousElementSibling.stepUp()">
                            <img alt="plus" src="images/plus.png" class="buttonPlus"/>
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
                <img src="images/vcsconflicting_93497.png" class="buttonDelete"/>
            </button>
            
            <p>${basket[key].name}</p>
            
            <button type="button" onclick="setQuantityProductInBasket(${basket[key].id}, -1)">
                <img alt="minus" src="images/minus.png" class="buttonMinus"/>
            </button>

                <input class="quantity" type="number" min="1" max="20" value="${basket[key].quantity}" readonly>

            <button type="button" onclick="setQuantityProductInBasket(${basket[key].id}, 1)">
                <img alt="plus" src="images/plus.png" class="buttonPlus"/>
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
        addProductIncustomSandwich("white-italian");
        addProductIncustomSandwich("1x");
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

    let sum = getSumProductInCustomSandwich() + customSandwich.price;
    let div = document.createElement('div');
    const defultProductMenuId = "size";

    div.id = "modalWindow";

    content.after(div);

    modalWindow.insertAdjacentHTML("afterbegin", /*html*/`
    <div class="modalOverlay" id="modalOverlay"></div>
        <div class="modalContainer">
            <div class="modalContent">
                <button class="closeButton" onclick="removeModalCreateSandwich()">X</button>
                <div id="navMenuModal">
                <ul id="menuModal">
                    <li  class="categoryMenuModal" id="size"><a>Размер</a></li>
                    <li  class="categoryMenuModal" id="bread"><a>Хлеб</a></li>
                    <li  class="categoryMenuModal" id="vegetable"><a>Овощи</a></li>
                    <li  class="categoryMenuModal" id="sauce"><a>Соусы</a></li>
                    <li  class="categoryMenuModal" id="filling"><a>Начинка</a></li>
                    <li onclick="showSandwichDone()" id="sandwichDone">Готово</li>
                </ul>
                <button id="backButton" onclick="manageModalButton (-1)">Назад</button>
                <button id="forwardButton" onclick="manageModalButton (1)">Вперед</button>
                </div>
                <div id="productContainer"></div>
                
            </div>
        </div>
    `);

    showProductMenuModal(defultProductMenuId);
    selectCategoryMenuModal();

}

function selectCategoryMenuModal() {
    let categories = document.querySelectorAll('.categoryMenuModal');

    for (let category of categories) {

        category.addEventListener('click', function () {

            showProductMenuModal(category.id);

        })
    }
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
    let sum = getSumProductInCustomSandwich() + customSandwich.price;

    div.id = "productContainer";

    navMenuModal.after(div);

    productContainer.insertAdjacentHTML("afterbegin", /*html*/`
    <div class="doneProductContainer">

        <div class="customSandwichMenu">
            <div class="customSandwichPreview">
                <img class="foodPicture" src="${customSandwich.image}">
            </div>

            <div id="customSandwichContainer">
                <p id="yourSandwichIsDone">Ваш сендвич готов!</p>
            </div>
        </div>
            
        <div id="orderCustomSandwich">
            <div>${customSandwich.name}</div>
            <p>Цена: ${sum} руб.</p>
            <button class="buttonBuy" onclick="addCustomSandwichToBasket()">В КОРЗИНУ</button>
        </div>

    </div>
    `);
    showComponentCustomSandwich();

    showModalButton();
    document.getElementById('sandwichDone').style.background = 'rgb(235, 74, 52)';
    document.getElementById(previousElementModalMenu).style.background = 'white';

    previousElementModalMenu = 'sandwichDone';
}

function addCustomSandwichToBasket() {
    customSandwich.id = new Date().getTime();
    customSandwich.name = customSandwich.name + " custom";
    customSandwich.price = customSandwich.price + Number(getSumProductInCustomSandwich());

    basket.push(customSandwich);
    removeModalCreateSandwich();
    showBasket();
}

async function showProductMenuModal(categoryId) {

    productContainer.remove();

    indexMenuModal = menuModalCategorylId.findIndex(category => category === categoryId);

    let products = await getElementProduct(categoryId);
    let div = document.createElement('div');

    div.id = "productContainer";

    navMenuModal.after(div);

    for (let key in products) {

        productContainer.insertAdjacentHTML("afterbegin", /*html*/`
        <div class="modalProductCard" id="${key}">
        <div class="foodPicture">
            <img src="${products[key].image}">
        </div>

        <div>${products[key].name}</div>

        <p>Цена: ${products[key].price} руб.</p>

    </div>
    `);
    }
    showModalButton();
    selectProductModal();
    document.getElementById(previousElementModalMenu).style.background = 'white';
    document.getElementById(categoryId).style.background = 'rgb(235, 74, 52)';

    previousElementModalMenu = categoryId;
}

function removeModalCreateSandwich() {
    modalWindow.remove();
    componentsCustomSandwich = new Map();
}

function selectProductModal() {
    let products = document.querySelectorAll('.modalProductCard');

    for (let product of products) {

        product.addEventListener('click', function () {

            addProductIncustomSandwich(product.id);

        })
    }
}

function getSumProductInCustomSandwich() {
    let components = customSandwich.components;
    let sum = 0;
    for (let keyCategory in components) {
        for (let keyProduct in components[keyCategory]) {
            if (components[keyCategory][keyProduct].price) {
                sum += components[keyCategory][keyProduct].price;
            }
        }
    }
    return sum;
}

async function addProductIncustomSandwich(id) {
    let product = await getElementCustomSandwich(id);

    if (checkComponentCustomSandwich(id)) {
        let map = new Map(Object.entries(product));
        for (let key of map.keys()) {
            map.set(key, []);
        }
        product = Object.fromEntries(map.entries());
        customSandwich.components = Object.assign(customSandwich.components, product);

    } else {

        customSandwich.components = Object.assign(customSandwich.components, product);
    }

    if (Object.keys(customSandwich.components.bread).length == 0) {
        let defaultBread = await getElementCustomSandwich("white-italian");
        customSandwich.components = Object.assign(customSandwich.components, defaultBread);
    }

    if (Object.keys(customSandwich.components.size).length == 0) {
        let defaultSize = await getElementCustomSandwich("1x");
        customSandwich.components = Object.assign(customSandwich.components, defaultSize);
    }

    componentsCustomSandwich = new Map();

}

function checkComponentCustomSandwich(id) {
    let map = new Map(Object.entries(customSandwich.components));
    for (let value of map.values()) {
        let component = Object.assign(value);
        for (let key in component) {
            if (key === id) {
                return true;
            }
        }
    }
    return false;
}

function showComponentCustomSandwich() {

    addComponentCustomSandwich();
    addEmptyComponentsCustomSandwich();

    componentsCustomSandwich.forEach((value, key) => {
        customSandwichContainer.insertAdjacentHTML("beforeend", /*html*/`
        <div class="listComponentSandwiches">${key}: ${value}</div>`);
    });
}

function addEmptyComponentsCustomSandwich() {

    for (let key in comps) {
        if (!checkCategoryCustomSandwich(comps[key])) {
            componentsCustomSandwich.set(comps[key], "Нет");
        }
    }
}

function addComponentCustomSandwich() {

    let currentComponents = customSandwich.components;

    for (let key in currentComponents) {
        for (let keyCategory in currentComponents[key]) {
            for (let keyComps in comps) {
                if (key === keyComps) {
                    componentsCustomSandwich.set(comps[keyComps], currentComponents[key][keyCategory].name);
                }
            }
        }
    }
}

function checkCategoryCustomSandwich(currentKey) {

    for (let keyCategory of componentsCustomSandwich) {
        if (currentKey === keyCategory[0] && keyCategory[1] != undefined) {

            return true;
        }
    }
    return false;
}


