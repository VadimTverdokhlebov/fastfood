"use strict";
const basket = [];

showSelectedProductCategory();
showProductFromBasket();

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

    let menu = await getMenuProduct();
    let div = document.createElement('div');

    content.remove();

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
                        <botton type="botton" onclick="this.nextElementSibling.stepDown()">
                            <img alt="minus" src="i/minus.png" class="bottonMinus"/>
                        </botton>

                        <input class="quantity" id="quantity${menu[key].id}" type="number" min="1" max="20" value="1" readonly>

                        <botton type="botton" onclick="this.previousElementSibling.stepUp()">
                            <img alt="plus" src="i/plus.png" class="bottonPlus"/>
                        </botton>
                    </div>
                    <input class="bottonBuy" type="button" value = "В КОРЗИНУ" 
                        onclick = "addProductInBasket(${menu[key].id}, getQuantityProduct('quantity${menu[key].id}'))">
                </form>

            </div>`);
        }
    }
}

function showProductFromBasket() {

    let div = document.createElement('div');

    basketContainer.remove();

    div.id = "basketContainer";

    basketTitle.after(div);

    for (let key in basket) {
        basketContainer.insertAdjacentHTML("afterbegin", /*html*/`
        <div class="basketProduct" id="positionProductInBasket${basket[key].id}">
            <p>${basket[key].name}</p>
            <p>${basket[key].quantity}</p>
            <botton type="botton" id="idProductInBasket${basket[key].id}" onclick="removeProductInBasket(${basket[key].id})">
                <img src="i/minus.png" class="bottonMinus"/>
            </botton>
        </div>
        `);

    }
}

function removeProductInBasket(id) {
    for (let key in basket) {
        if (basket[key].id === id) {
            let index = basket.indexOf(basket[key]);
            if (index > -1) {
                basket.splice(index, 1);
                document.getElementById(`positionProductInBasket${id}`).remove();
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

function setQuantityProductInBasket(id, quantity) {
    for (let key in basket) {
        if (basket[key].id === id) {
            basket[key].quantity += Number(quantity);
            break;
        }
    }
}

async function addProductInBasket(id, quantity) {

    let product = await getElementMenuProduct(id, quantity);
    let productInBasket = checkProductInBasket(id);

    if (productInBasket == true) {

        setQuantityProductInBasket(id, quantity);
        showProductFromBasket();

    } else {

        basket.push(product);
        showProductFromBasket();
        
    }
}

