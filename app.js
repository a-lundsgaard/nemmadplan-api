
    const express = require('express');
    const { graphqlHTTP } = require('express-graphql');
    const mongoose = require('mongoose');
    const app = express();

    const graphQlSchema = require('./graphql/schema/index');
    const graphQlResolvers = require('./graphql/resolvers/index');
    const isAuth = require('./middleware/is-auth');
    const upload = require('./middleware/disk-storage');

    const convertImageRoute = require('./routes/convertImage');

    const bodyParser = require('body-parser');

    app.use(bodyParser.json());



    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      }
      next();
    });

    app.use(isAuth); // express will automatically use this as a valid middleware and run it on every incoming request
    app.use(upload.single('productImage')); // handling image uploads. Name must be the same as the one appended in the form data
    app.use('/uploads',express.static('uploads')) // makes the folder public so the images is available on the server


  // endpoint for cronjob to keep heroku dyno from sleeping
    app.get('/',(req,res) => {
      return res.send(req.get('host'));
    });

    app.post('/uploads', (req,res) => {
      console.log('hit uploads route');

      console.log('Found data on file: ', req.file);
      return res.json({...req.file, imageUrl: req.protocol + '://' + req.get('host')+ '/' + req.file.path});
    });

    app.use('/convertimage', convertImageRoute);


  /*   app.post('/convertImage', (req,res) => {
      console.log('hit uploads route');

      console.log('Found data on file: ', req.file);
      return res.json({...req.file, imageUrl: req.protocol + '://' + req.get('host')+ '/' + req.file.path});
    }); */


    app.use(
      '/graphql',
      graphqlHTTP({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true
      })
    );

      let port = process.env.PORT;
      if (port == null || port == "") {
          port = 8080;
      }

     mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@askeapi.8i9lf.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        //useMongoClient: true
      }).then((data) => {
       app.listen(port, function () {
         console.log('Express server listening on port ' + port);
       });
      console.log('MongoDB connected...')
    }).catch(err => {
       console.log('Kunne ikke oprette forbindelse til databasen')
      console.log(err) })

    module.exports = app;



