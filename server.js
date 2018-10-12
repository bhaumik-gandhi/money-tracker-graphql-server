const express = require('express');
const expressGraphQL = require('express-graphql');

// Create express app
const app = express();

app.listen(4000, () => {
    console.log('Server is start on port 4000');
});

// Import schemas
const schema = require('./schema/schema');

app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true 
}))