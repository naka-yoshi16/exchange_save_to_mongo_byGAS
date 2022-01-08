const updateOneEndpoint = 'https://data.mongodb-api.com/app/data-whorv/endpoint/data/beta/action/updateOne';

function updateTest() {
  
 const activeSheetsApp = SpreadsheetApp.getActiveSpreadsheet();
 const sheet = activeSheetsApp.getSheets()[3];
 const partname = sheet.getRange("c4").getValue();
 const partdate = sheet.getRange("b7").getValue();
 const partvalue = sheet.getRange("c7").getValue();
 const BaseCurrency = sheet.getRange("B2").getValue();

 const saveDocuments = [];
 const ComparedCurrencies = [];
 const rates = [];

  //  現在のデータを取得
  const getDocuments = sheet.getRange(`B4:S7`).getValues();
  console.log(getDocuments)

  // 比較通貨とレートを抽出 getData(getDocuments, ComparedCurrencies, rates)
  getData(getDocuments, ComparedCurrencies, rates)
  // console.log(ComparedCurrencies)
  // console.log(rates)

  // 比較通貨とレートを整形
  // console.log(saveDocuments)
  // 通貨を格納 
  mapCurrencies(saveDocuments, ComparedCurrencies, BaseCurrency)
  // console.log(saveDocuments)

  // 日付、レートを格納 
  mapRates(saveDocuments, rates)
  // console.log(JSON.stringify(saveDocuments))
 
 //  sheet.getRange(`C3:K103`).clear()
 
 const apikey = getAPIKey()
  
//  const response = UrlFetchApp.fetch(findEndpoint, options);
//  const documents = JSON.parse(response.getContentText()).documents
 
  // const document = { date: { $date: { $numberLong: `${(new Date()).getTime()}` } }, query, nresults, by: Session.getActiveUser().getEmail() }
  // const document = 
  //   { 
  //     // date: { $date: { $numberLong: `${(new Date()).getTime()}` } }, 
  //     date: partdate, 
  //     currency: partname,
  //     value: partvalue }
  // console.log(document)

  // ひと通貨ごとに保存
  for(i=0; i<saveDocuments.length; i++){
    const payload = {
      // document: document, collection: "exchange",
      // document: saveDocuments, collection: "exchange", // Exception: Request failed for https://data.mongodb-api.com returned code 400. Truncated server response: Failed to insert document: FunctionError: mongodb insert: argument must be an object (use muteHttpExceptions option to examine full response)
      dataSource: "Cluster0",
      database: "Exchange_Gas",
      collection: "exchange",
      filter: { ComparedCurrency:"AUD",
                // priceDiary: [
                //   {Date: 112}
                // ]
                },
      // filter: { _id: "61d714fa2c981d126beb92c1" },
      // _id:`ObjectId("61d714fa2c981d126beb92c1")`,
      // document: saveDocuments[i], 
      "update": {
          "$set": {
          // "$setOnInsert": {
          // "$upsert": {
              // "priceDiary": [0,1,2],
              "priceDiary": [
                {
                  "Date": "2022-01-07T14:58:00.000Z",
                  "open": "",
                  "high": "",
                  "low": "",
                  "close": {
                      "$numberDouble": "82.96359"
                  },
                },
                {Date: 113},
                ],
              // "completedAt": { "$date": { "$numberLong": "1637083942954" } }
          },          
      },
      upsert:true
    }

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      headers: { "api-key": apikey }
    };

    // const response = UrlFetchApp.fetch(insertOneEndpoint, options);
    const response = UrlFetchApp.fetch(updateOneEndpoint, options);
  }
}