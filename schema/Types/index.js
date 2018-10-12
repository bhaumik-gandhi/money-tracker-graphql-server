const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLInt
} = graphql;
const axios = require('axios');
const Config  = require('../../Config');

const { JSON_SERVER_URL } = Config;

const ItemType = new GraphQLObjectType({
    name: 'Item',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString }
    })
});


const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        item: {
            type: ItemType,
            resolve: async (parentValue, args) => {
                const { data } = await axios.get(JSON_SERVER_URL + `items/${parentValue.itemId}`);
                return data;
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString }
    })
});

const TransactionType = new GraphQLObjectType({
    name: 'Transaction',
    fields: () => ({
        id: { type: GraphQLInt },
        type: { type: GraphQLString },
        amount: { type: GraphQLFloat },
        category: {
            type: CategoryType,
            resolve: async (parentValue, args) => {
                const { data } = await axios.get(JSON_SERVER_URL + `categories/${parentValue.categoryId}`);
                return data;
            }
        },
        user: {
            type: UserType,
            resolve: async (parentValue, args) => {
                const { data } = await axios.get(JSON_SERVER_URL + `users/${parentValue.userId}`);
                return data;
            }
        }
    })
});

module.exports = {
    ItemType,
    CategoryType,
    TransactionType
};