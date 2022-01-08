// options
function g_options(payload){
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    headers: { "api-key": getAPIKey() }
  } 
  return options
}


const findEndpoint      = 'https://data.mongodb-api.com/app/data-whorv/endpoint/data/beta/action/find';

const insertOneEndpoint = 'https://data.mongodb-api.com/app/data-whorv/endpoint/data/beta/action/insertOne';

const updateOneEndpoint = 'https://data.mongodb-api.com/app/data-whorv/endpoint/data/beta/action/updateOne';