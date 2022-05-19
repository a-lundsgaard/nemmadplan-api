const rootQuery = `
type RootQuery {
        verifyUser(token: String!): User
        getSales(salesCrawlerInput: salesCrawlerInput!): [Product]
        weekPlans: [WeekPlan!]!
        receipts: [Receipt!]!
        login(email: String!, password: String!): AuthData!
    }`

module.exports = rootQuery;