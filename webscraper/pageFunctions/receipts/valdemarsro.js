
// "https://www.valdemarsro.dk/chili-con-carne/"

function valdemarsro() {

  console.log('Running page function')

  const ingredientData = $('#recipe-intro').find('[itemprop="recipeIngredient"]').get();
  const ingrHeaders = ingredientData.map(el => {
    let text = el.innerText;
    return text.match(/\d/g) ? text.split(' ').slice(2).join(' ') : text;
  })


  const quantity = ingredientData.map(el => Number(el.innerText.split(' ')[0].replace(",",".")) || '')
  console.log(quantity)

  const unit = ingredientData.map(el => {
    return  el.innerText.split(' ')[1];
  })

  console.log(unit)
  const ingredients = ingrHeaders.map( (header, i)=> ({ name: header, unit: unit[i], quantity: quantity[i]} ))
  console.log(ingrHeaders)


  return {
    title: $('h1').text(),
    description: $('#recipe-intro div.content').get().text(),
    ingredients: ingredients,
  };

}

module.exports = valdemarsro;