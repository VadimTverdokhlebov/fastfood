"use strict";
const basket = [];

showSelectedProductCategory();
showBasket();

async function getMenuProduct() {

    try {

        const url = 'http://localhost:8080/api';
        const response = await fetch(url);
        const result = await response.json();
        const menu = result.menu;

        return menu;

    } catch (err) {

        alert(`Не удалось загрузить список товаров \n ${err}`);

    }

}

function showSelectedProductCategory() {

    let categoriesMenu = document.querySelectorAll('.category');
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
                        onclick = "addProductInBasket(${menu[key].id}, ${categoryId}, getQuantityProduct('quantity${menu[key].id}'))">
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

    basketTotal.insertAdjacentHTML("afterbegin", /*html*/ `<p> Итого: ${sum} руб. </p>` );
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

function setQuantityProductInBasket(id, step){
    for (let key in basket) {
        if (basket[key].id === id) {
            basket[key].quantity += Number(step);
            if(basket[key].quantity <= 0) {
                removeProductInBasket(id);
            }
            showBasket();
            break;
        }
    }
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
    
    if (category.id == 'sandwiches'){
        alert(category.id);

    } else if (productInBasket == true) {

        addQuantityProductInBasket(id, quantity);
        showBasket();
        
    } else {

        basket.push(product);
        showBasket();
    }
}

function getSumOrder() {
    let sum = 0;
    if(basket.length > 0){
        for (let key in basket){
            sum += basket[key].quantity * basket[key].price;
        }
    } 
    return sum; 
}


