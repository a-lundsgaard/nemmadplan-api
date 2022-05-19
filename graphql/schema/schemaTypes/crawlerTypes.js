

const salesCrawlerSchema = {

  salesCrawlerTypes: `


    type SalesCrawler {
      products: [String!]!
      chains: Chains      
    }
    
    type Chains {
      wanted: Boolean
      chainNames: [String!]      
    }
    
    type Product {
      title: String
      price: Float
      unit: String
      quantity: Float
      pricePrKg: String
      chain: String
      img: String
      date: String
    }`,
  


  salesCrawlerInput: `
    input salesCrawlerInput {
      products: [String!]
      chains: chainInput
    }
    
    input chainInput {
      wanted: Boolean!
      chainNames: [String!]!
    }`

    
}

module.exports = salesCrawlerSchema;