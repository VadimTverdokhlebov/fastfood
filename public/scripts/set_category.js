"use strict";
let url = '/api'
//let response = await fetch(url);

//let commits = await response.json();
const getResourse = async (url) => {
    const response = await fetch(url)
    
    console.log(response)
}

let menu = [
    {
        name: 'Овощной',
        category: 'sandwiches'
    },
    {
        name: 'ФишБургер',
        category: 'burgers'
    },
    {
        name: 'Кубит',
        category: 'salads'
    }
]
getResourse(url)
//let filterSelectCategory = document.getElementById('menu');