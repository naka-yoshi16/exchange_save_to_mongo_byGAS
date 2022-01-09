const findEndpoint      = 'https://data.mongodb-api.com/app/data-whorv/endpoint/data/beta/action/find';

const insertOneEndpoint = 'https://data.mongodb-api.com/app/data-whorv/endpoint/data/beta/action/insertOne';

const updateOneEndpoint = 'https://data.mongodb-api.com/app/data-whorv/endpoint/data/beta/action/updateOne';

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

// apikey取得
function getAPIKey() {
 const userProperties = PropertiesService.getUserProperties();
 let apikey = userProperties.getProperty('APIKEY');
 let resetKey = false; //Make true if you have to change key
 if (apikey == null || resetKey ) {
  var result = SpreadsheetApp.getUi().prompt(
   'Enter API Key',
   'Key:', SpreadsheetApp.getUi().ButtonSet);
  apikey = result.getResponseText()
  userProperties.setProperty('APIKEY', apikey);
 }
 return apikey;
} 