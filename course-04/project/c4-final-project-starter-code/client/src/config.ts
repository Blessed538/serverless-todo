// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'pttlzl3cad'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`


export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-58yxezd7.us.auth0.com',            // Auth0 domain
  clientId: 'U1sFb8R6UmJVVrpaKU0hi1n7avvWR0hx',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

// GET - https://pttlzl3cad.execute-api.us-east-2.amazonaws.com/dev/todos
// POST - https://pttlzl3cad.execute-api.us-east-2.amazonaws.com/dev/todos
// PATCH - https://pttlzl3cad.execute-api.us-east-2.amazonaws.com/dev/todos/{todoId}
// DELETE - https://pttlzl3cad.execute-api.us-east-2.amazonaws.com/dev/todos/{todoId}
// POST - https://pttlzl3cad.execute-api.us-east-2.amazonaws.com/dev/todos/{todoId}/attachment