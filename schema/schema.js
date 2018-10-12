
const graphql = require('graphql');
const axios = require('axios');
const { 
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLFloat,
    GraphQLNonNull,
    GraphQLInt
} = graphql;

const Config  = require('../Config');
const Types = require('./Types');

const { 
    CategoryType, 
    ItemType,
    TransactionType
} = Types;
const { JSON_SERVER_URL } = Config;

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        items: {
            type: new GraphQLList(ItemType),
            resolve: async () => {
                const { data } = await axios.get(JSON_SERVER_URL + `items`);
                return data;
            }
        },
        item: {
            type: ItemType,
            args: { id : { type: GraphQLInt } },
            resolve: async (parentValue, args) => {
                const { data } = await axios.get(JSON_SERVER_URL + `items/${args.id}`);
                return data;
            }
        },
        categories: {
            type: new GraphQLList(CategoryType),
            resolve: async () => {
                const { data } = await axios.get(JSON_SERVER_URL + `categories`);
                return data;
            }
        },
        transactions: {
            type: new GraphQLList(TransactionType),
            resolve: async () => {
                const { data } = await axios.get(JSON_SERVER_URL + `transactions`);
                return data;
            }
        },
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTransaction: {
            type: TransactionType,
            args: {
                type: { type: new GraphQLNonNull(GraphQLString) },
                amount: { type: new GraphQLNonNull(GraphQLFloat) },
                categoryId: { type: new GraphQLNonNull(GraphQLString) },
                userId: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parentValue, { type, amount, categoryId, userId }) => {
                const { data } = await axios.post( JSON_SERVER_URL + 'transactions', {
                    type,
                    amount,
                    categoryId,
                    userId
                });
                return data;
            }
        } 
    }
})

module.exports = new GraphQLSchema({
    query:  RootQuery,
    mutation
});