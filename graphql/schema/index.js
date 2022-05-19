const { buildSchema } = require('graphql');

const rootQuery = require('./root/query');
const rootMutation = require('./root/mutation');

const {receiptTypes, receiptInput } = require('./schemaTypes/receiptTypes');
const {weekPlanTypes, weekPlanInput} = require('./schemaTypes/weekPlanTypes');
const {userTypes, userInput, authType} = require('./schemaTypes/userTypes');
const {salesCrawlerTypes, salesCrawlerInput} = require('./schemaTypes/crawlerTypes')

module.exports = buildSchema(`

    ${salesCrawlerTypes}
    ${salesCrawlerInput}

    ${receiptTypes}
    ${receiptInput}
    
    ${weekPlanTypes}
    ${weekPlanInput}
    
    ${userTypes}
    ${userInput}
    ${authType}
    
    ${rootQuery}
    ${rootMutation}
   
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);