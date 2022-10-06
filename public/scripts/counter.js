"use strict";
function handleFormSubmit(event){
    event.preventDefault();
}

let formChangeQuantity = document.forms.addBasket;
let quantityProduct = formChangeQuantity.elements.inputQuantity.value;

inputQuantity.onblur = function(){
    quantityProduct = formChangeQuantity.elements.inputQuantity.value;
}
reduceQuantity.onclick = function(){
    --quantityProduct
    inputQuantity.value = quantityProduct
    console.log(quantityProduct)
}
addQuantity.onclick = function(){
    ++quantityProduct
    inputQuantity.value = quantityProduct
    console.log(quantityProduct)
}

if(formChangeQuantity){
    formChangeQuantity.addEventListener('submit', handleFormSubmit);
}
