const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const app = express();

const PORT =3000;

app.use(bodyParser.json());




const HASURA_OPERATION = `
mutation signup($object: default_users_insert_input!) {
  insert_default_users_one(object: $object) {
    id
   
  }
}
`;

// execute the parent operation in Hasura
const execute = async (variables) => {
  const fetchResponse = await fetch(
    "http://localhost:8080/v1/graphql",
    {
      method: 'POST',
      body: JSON.stringify({
        query: HASURA_OPERATION,
        variables
      })
    }
  );
  const data = await fetchResponse.json();
  console.log('DEBUG: ', data);
  return data;
};
  

// Request Handler
app.post('/signup', async (req, res) => {

  // get request input
  const { object } = req.body.input;

  // run some business logic

  // execute the Hasura operation
  const { data, errors } = await execute({ object });

  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0])
  }

  // success
  return res.json({
    ...data.insert_default_users_one
  })

});
app.get('/hello', async (req, res) => {
  return res.json({
    hello: "world"
  });
});

app.listen(PORT);
