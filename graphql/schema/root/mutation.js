const rootMutation = `type RootMutation {
        scrapeReceipt(crawlerInput: String!): Receipt
        createWeekPlan(weekPlanInput: weekPlanInput): WeekPlan
        deleteWeekPlan(weekPlanId: ID!): WeekPlan!
        createReceipt(receiptInput: receiptInput): Receipt
        updateRecipe(receiptInput: receiptInput): Receipt
        deleteReceipt(receiptId: ID!): Receipt!
        createUser(userInput: UserInput): User

    }`

module.exports = rootMutation;