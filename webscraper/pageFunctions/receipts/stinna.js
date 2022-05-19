

// f.eks. https://stinna.dk/aftensmad/vegetarisk-paprikagryde.html

function stinna() {

  console.log('Running page function')

  const ingredientData = $('.wprm-recipe-ingredients li').get();
  const ingrHeaders = ingredientData.map(el => el.innerText.split(' ').slice(2).join(' '))

  console.log(ingrHeaders)

  const quantity = ingredientData.map(el => el.innerText.split(' ')[0])

  console.log(quantity)
  const unit = ingredientData.map(el => el.innerText.split(' ')[1])

  console.log(unit)
  const ingredients = ingrHeaders.map( (header, i)=> ({ name: header, unit: unit[i], quantity: quantity[i]}))

  console.log(ingrHeaders)


  return {
    title: $('h1').text(),
    description: $('.wprm-recipe-instructions-container.wprm-block-text-normal').text(),
    ingredients: ingredients,
  };

}

module.exports = stinna;