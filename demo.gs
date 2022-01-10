// // Google AppsScriptsを使用してMongoDBAtlasからデータを取得する
// // const findEndpoint = 'https://data.mongodb-api.com/app/data-amzuu/endpoint/data/beta/action/find';
// // const findEndpoint = 'https://data.mongodb-api.com/app/data-whorv/endpoint/data/beta/action/find';

// const clusterName = "Cluster0"
 
// function getAPIKey() {
//  const userProperties = PropertiesService.getUserProperties();
//  let apikey = userProperties.getProperty('APIKEY');
//  let resetKey = false; //Make true if you have to change key
//  if (apikey == null || resetKey ) {
//   var result = SpreadsheetApp.getUi().prompt(
//    'Enter API Key',
//    'Key:', SpreadsheetApp.getUi().ButtonSet);
//   apikey = result.getResponseText()
//   userProperties.setProperty('APIKEY', apikey);
//  }
//  return apikey;
// } 
 
// function lookupInspection() {
//  const activeSheetsApp = SpreadsheetApp.getActiveSpreadsheet();
//  const sheet = activeSheetsApp.getSheets()[0];
//  const partname = sheet.getRange("B1").getValue();
// //  const partialName = sheet.getRange("a5").getValue();
 
 
//  sheet.getRange(`C3:K103`).clear()
 
//  const apikey = getAPIKey()
 
//  //We can do operators like regular expression with the Data API
//  const query = { business_name: { $regex: `${partname}`, $options: 'i' } }
//  const order = { business_name: 1, date: -1 }
//  const limit = 100
//  //We can Specify sort, limit and a projection here if we want
//  const payload = {
//   filter: query, sort: order, limit: limit,
//   collection: "inspections", database: "sample_training", dataSource: clusterName
//  }
 
//  const options = {
//   method: 'post',
//   contentType: 'application/json',
//   payload: JSON.stringify(payload),
//   headers: { "api-key": apikey }
//  };
 
//  const response = UrlFetchApp.fetch(findEndpoint, options);
//  const documents = JSON.parse(response.getContentText()).documents
 
//  logUsage(partname, documents.length, apikey); //  <---- Add This line

//  for (d = 1; d <= documents.length; d++) {
//   let doc = documents[d - 1]
//   fields = [[doc.business_name, doc.date, doc.result, doc.sector, 
//        doc.certificate_number, doc.address.number,
//   doc.address.street, doc.address.city, doc.address.zip]]
//   let row = d + 2
//   sheet.getRange(`C${row}:K${row}`).setValues(fields)
//  }
// }

// // Google AppsScriptsからMongoDBAtlasへの書き込み
// // const insertOneEndpoint = '[https://data.mongodb-api.com/app/data-whorv/endpoint/data/beta/action/insertOne](https://data.mongodb-api.com/app/data-whorv/endpoint/data/beta/action/insertOne)'
// // const insertOneEndpoint = 'https://data.mongodb-api.com/app/data-whorv/endpoint/data/beta/action/insertOne'

// function logUsage(query, nresults, apikey) {
//   // const document = { date: { $date: { $numberLong: ${(new Date()).getTime()} } }, query, nresults, by: Session.getActiveUser().getEmail() } 
//   const document = { date: { $date: { $numberLong: `${(new Date()).getTime()}` } }, query, nresults, by: Session.getActiveUser().getEmail() }
//   console.log(document)
//   const payload = {
//     document: document, collection: "log",
//     database: "sheets_usage", dataSource: "Cluster0"
//   }

//   const options = {
//     method: 'post',
//     contentType: 'application/json',
//     payload: JSON.stringify(payload),
//     headers: { "api-key": apikey }
//   };

//   const response = UrlFetchApp.fetch(insertOneEndpoint, options);
// }