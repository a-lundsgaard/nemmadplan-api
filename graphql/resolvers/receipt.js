
const Receipt = require('../../models/receipt');
const User = require('../../models/user');

const runCrawler = require('../../webscraper/crawlers/baseCrawler');
const runSalesCrawler = require('../../webscraper/crawlers/salesCrawler');
const pageFunctions = require('../../webscraper/pageFunctions');
const { transformReceipt } = require('./merge');
const fs = require('fs');


module.exports = {

  getSales: async (args, req) => {
    console.log('Get sales called');

    const salesData = await runSalesCrawler(pageFunctions.tilbudsugen, args.salesCrawlerInput);

    const stringifiedData = JSON.stringify(salesData, null, 2);
    fs.writeFileSync('./salesData.json', stringifiedData, (err) => {
      if (err) {
        throw err
      }
      console.log('Data written');
    });

    return salesData;
    //return await runSalesCrawler(pageFunctions.tilbudsugen, args.salesCrawlerInput);
  },



  scrapeReceipt: async (args, req) => {

    try {
      const url = args.crawlerInput;
      // Makes a lookup in the imported object module containiog the different pagefunctions
      const pageFunctionToRun = pageFunctions[Object.keys(pageFunctions).find(key => url.includes(key))];
      const result = await runCrawler(url, pageFunctionToRun);
      console.log(result)

      return new Receipt({
        name: result.title,
        type: 'veg',
        persons: result.persons,
        source: result.source,
        text: result.description,
        ingredients: result.ingredients,
        image: result.image,
        favorite: false,
        createdAt: new Date(),
        creator: "5f4ff005e1144e1ad8709e7f" // needs to find creator manually by token later
      })

    } catch (error) {
      throw error
    }
  },


  receipts: async (args, req) => {

    // protecting our resolver by accessing metadata from the request object attached by our middleware
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }

    try {

      // const user = await User.findById(req.userId);

      const userDishes = await Receipt.find({ creator: req.userId })
      //const userDishes = await Receipt.find({creator: "5f7a211453451f20206bd7a4"})


      return userDishes.map(dish => {
        return transformReceipt(dish);
      });
    } catch (err) {
      throw err;
    }
  },

  createReceipt: async (args, req) => {

    // protecting our resolver by accessing metadata from the request object attached by our middleware
    /* if(!req.isAuth) {
       throw new Error('Unauthenticated');
     }*/

    console.log('Function called')
    console.log(args.receiptInput.ingredients)

    // find user by token here

    const receipt = new Receipt({
      name: args.receiptInput.name,
      type: args.receiptInput.type,
      persons: args.receiptInput.persons,
      source: args.receiptInput.source,
      text: args.receiptInput.text,
      image: args.receiptInput.image,
      favorite: false,
      ingredients: args.receiptInput.ingredients,
      creator: "5f7a211453451f20206bd7a4" // needs to find creator manually by token later
    });

    let createdReceipt;
    try {
      const result = await receipt.save();
      createdReceipt = transformReceipt(result);
      // const creator = await User.findById("5f4ff005e1144e1ad8709e7f");

      console.log(createdReceipt)

      // console.log(creator);

      //   if (!creator) {
      //  throw new Error('User not found.');
      // }
      //creator.createdEvents.push(event);
      // await creator.save();

      return createdReceipt;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  updateRecipe: async (args, req) => {
    // protecting our resolver by accessing metadata from the request object attached by our middleware
     if(!req.isAuth ) {
       throw new Error('Unauthenticated');
     }
    console.log('Update recipe function called')
    console.log(args.receiptInput)

    // find user by token here
    try {
      const recipeToUpdate = await Receipt.findById(args.receiptInput._id);
      if (!recipeToUpdate) {
        throw new Error( 'Recipe not found.')
      }

      if (req.userId != recipeToUpdate.creator ) {
        throw new Error('User not authenticated')
      }

      recipeToUpdate.name = args.receiptInput.name;
      recipeToUpdate.type = args.receiptInput.type;
      recipeToUpdate.persons = args.receiptInput.persons;
      recipeToUpdate.source = args.receiptInput.source
      recipeToUpdate.text = args.receiptInput.text;
      recipeToUpdate.ingredients = args.receiptInput.ingredients;
      recipeToUpdate.image = args.receiptInput.image;
      recipeToUpdate.favorite = args.receiptInput.favorite || false;


      let updatedRecipe;
      const result = await recipeToUpdate.save();
      updatedRecipe = transformReceipt(result);
      //console.log(createdReceipt);
      console.log('Recipe succesfully updated');
      // console.log(creator);

      //   if (!creator) {
      //  throw new Error('User not found.');
      // }
      //creator.createdEvents.push(event);
      // await creator.save();

      return updatedRecipe;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  deleteReceipt: async (args, req) => {

    // protecting our resolver by accessing metadata from the request object attached by our middleware
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    console.log('Function delete recipe was called');
    try {
      const userId = req.userId;
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found.');
      }

      const recipeToDelete = await Receipt.findOne({ _id: args.receiptId, creator: userId })
      if (!recipeToDelete) {
        throw new Error('Receipt not found');
      }

      try {
        const filePath = 'uploads/' + recipeToDelete.image.split('/').pop();
        fs.unlinkSync(filePath);
      } catch (error) {
        console.log('External image not found')
      }

      await Receipt.findByIdAndDelete(args.receiptId);
      console.log('Recipe successfully deleted');
      return recipeToDelete;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

};