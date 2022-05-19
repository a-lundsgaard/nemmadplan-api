//const { json } = require("express");

async function nemlig() {

  
    const productId = $('.productlist-item__link').eq(0).attr('href').split('-')[1]


    const body = {productId: "5015695", quantity: 1};

    try {
        const data = await fetch("https://www.nemlig.com/webapi/basket/PlusOneToBasket", {
            method:'post',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        })

        const jsonData = await data.json();
        return jsonData;
        
    } catch (error) {
        throw error
    }


  /*
  .then(res => res.json())
    .catch(e => console.log(e))
    .then(json => console.log(json))
    .catch(e => console.log(e))*/

  }
  
  module.exports = nemlig;