

const receiptSchema = {

  receiptTypes: `
     type Receipt {
      _id: ID!
      name: String!
      type: String!
      persons: Float!
      source: String
      text: String!
      image: String
      favorite: Boolean
      ingredients: [Ingredient!]
      creator: User!
      createdAt: String!
      updatedAt: String!      
    }
    
    type Ingredient {
      name: String
      unit: String
      quantity: Float
    }`,

  receiptInput: `
  input receiptInput {
      _id: String
      name: String!
      type: String!
      persons: Float!
      source: String
      text: String!
      image: String
      favorite: Boolean
      ingredients: [ingredientInput]!
    }
    
    input ingredientInput {
      name: String
      unit: String
      quantity: Float
    }`
}

module.exports = receiptSchema;