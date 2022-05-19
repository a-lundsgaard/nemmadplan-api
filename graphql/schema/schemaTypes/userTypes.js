

const userSchema = {
  userTypes: `
  type User {
      _id: ID!
      firstName: String!
      lastName: String!
      email: String!
      password: String
      createdPlans: [WeekPlan!]
    }`,

  userInput: `
  input UserInput {
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    }`,

  authType: `
  type AuthData {
      userId: ID!
      token: String!
      tokenExpiration: Int!
    }`
}

module.exports = userSchema;