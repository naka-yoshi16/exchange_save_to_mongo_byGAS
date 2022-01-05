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
 
function saveDaily() {
  
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

// 比較通貨とレートを抽出
 for (d = 1; d <= getDocuments.length; d++) {
   const row = getDocuments[d - 1]
   const item = row[0]
   console.log(item)
   switch (item) {
    case 'Compared Currency':
      // console.log('a')
      row.forEach((value, index, array) => {
        if(index == 0) value = "";
        ComparedCurrencies.push(value)
      });
      break;
    case 'line':
      break;
    case 'Date':
      // console.log('b')
      break;
    default:
      console.log('rates');
      row.forEach((value, index, array) => {
        rates.push(value)
      });
   } 
   console.log(ComparedCurrencies)
   console.log(rates)
    // let doc = documents[d - 1]
    // fields = [[doc.business_name, doc.date, doc.result, doc.sector, 
    //      doc.certificate_number, doc.address.number,
    // doc.address.street, doc.address.city, doc.address.zip]]
    // let row = d + 2
    // sheet.getRange(`C${row}:K${row}`).setValues(fields)
  }

  // 比較通貨とレートを整形
  // for (i = 0; i < ComparedCurrencies.length/2; i++) {
  //   saveDocuments.push({})
  // }
  console.log(saveDocuments)
  // 通貨を格納
    saveDocumentsLen = -1;
    ComparedCurrencies.forEach((value, index, array) => {
      // console.log(index, index%2)
      if(index%2 == 0){
        saveDocuments.push({})
        saveDocumentsLen++;
        // saveDocuments[saveDocumentsLen].BaseCurrency = BaseCurrency
        saveDocuments[saveDocumentsLen]["BaseCurrency"] = BaseCurrency
      }else{
        // saveDocuments[saveDocumentsLen].ComparedCurrency = value
        saveDocuments[saveDocumentsLen]["ComparedCurrency"] = value
      }
    });
  console.log(saveDocuments)

  // 日付、レートを格納
    saveDocumentsLen = -1;
    rates.forEach((value, index, array) => {
      // console.log(index, index%2)
      if(index%2 == 0){
        saveDocumentsLen++;
        saveDocuments[saveDocumentsLen]["priceDiary"] = []
        saveDocuments[saveDocumentsLen]["priceDiary"][0] = {}
        saveDocuments[saveDocumentsLen]["priceDiary"][0].Date = value
      }else{
        saveDocuments[saveDocumentsLen]["priceDiary"][0].open = ""
        saveDocuments[saveDocumentsLen]["priceDiary"][0].high = ""
        saveDocuments[saveDocumentsLen]["priceDiary"][0].low = ""
        saveDocuments[saveDocumentsLen]["priceDiary"][0].close = value
      }
    });
  console.log(JSON.stringify(saveDocuments))

 
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

      document: saveDocuments[i], collection: "exchange",
      database: "Exchange_Gas", dataSource: "Cluster0"
    }

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      headers: { "api-key": apikey }
    };

    const response = UrlFetchApp.fetch(insertOneEndpoint, options);
  }
}
