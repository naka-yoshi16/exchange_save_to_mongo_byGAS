// const findEndpoint = 'https://data.mongodb-api.com/app/data-whorv/endpoint/data/beta/action/find';

// ============================================
// mongoの保存済データを取得  
// ============================================
function getMongoData() {
// https://docs.atlas.mongodb.com/api/data-api-resources/#find-multiple-documents
  const payload = {
      "dataSource": "Cluster0",
      "database"  : "Exchange_Gas",
      "collection": "exchange",
      // "filter": {"ComparedCurrency": "AUD"}//<query filter>,
      // "projection": <projection>,
      // "sort": <sort expression>,
      // "limit": 2, //<number>,
      // "skip": <number>
  }

  const response = UrlFetchApp.fetch(findEndpoint, g_options(payload));
  const getMongoData = JSON.parse(response.getContentText()).documents
  // console.log(response)
  // console.log(JSON.stringify(getMongoData, null, ' '))
  return getMongoData
}

// ============================================ 
// GoogleSpreadSheetからデータ(新規データ含む)取得
// ============================================
function getSprdShtData(){

 const activeSheetsApp = SpreadsheetApp.getActiveSpreadsheet();
//  const sheet = activeSheetsApp.getSheets()[3];
 const sheet = activeSheetsApp.getSheets()[2];
 const BaseCurrency = sheet.getRange("B2").getValue();

 const getSprdShtData = [];
 const ComparedCurrencies = [];
 const rates = [];

  //  現在のデータを取得
  // const getDocuments = sheet.getRange(`B4:S7`).getValues();
  const getDocuments = sheet.getRange(`B4:S37`).getValues();
  console.log(getDocuments)

  // 比較通貨とレートを抽出 getData(getDocuments, ComparedCurrencies, rates)
  getData(getDocuments, ComparedCurrencies, rates)
  // console.log(ComparedCurrencies)
  // console.log(rates)

  // 比較通貨とレートを整形
  // console.log(getSprdShtData)
  // 通貨を格納 
  mapCurrencies(getSprdShtData, ComparedCurrencies, BaseCurrency)
  // console.log(getSprdShtData)

  // 日付、レートを格納 
  mapRates(getSprdShtData, rates)
  console.log(JSON.stringify(getSprdShtData))
  return getSprdShtData
}


// ============================================ 
// 比較通貨とレートを抽出
// ============================================ 
function getData(getDocuments, ComparedCurrencies, rates) {
 for (d = 1; d <= getDocuments.length; d++) {
   const row = getDocuments[d - 1]
   const item = row[0]
    //  console.log(item)
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
      // console.log('rates');
      // row.forEach((value, index, array) => {
      //   rates.push(value)
      // });
      let ratesOneday = [];
      row.forEach((value, index, array) => {
        ratesOneday.push(value)
      });
      rates.push(ratesOneday)
   } 
  //  console.log(ComparedCurrencies)
  //  console.log(rates)
  }
}

// ============================================ 
// 通貨を格納 
// ============================================ 
function mapCurrencies(saveDocuments, ComparedCurrencies, BaseCurrency) {
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
}

// ============================================ 
// 日付、レートを格納 
// ============================================ 
function mapRates(saveDocuments, rates){
  // saveDocumentsLen = -1;
  // rates.forEach((value, index, array) => {
  rates.forEach((ratesOneday, days, array) => {
    saveDocumentsLen = -1;
    // console.log(index, index%2)
    ratesOneday.forEach((value, index, array) => {
      if(index%2 == 0){
        saveDocumentsLen++;
        if(!saveDocuments[saveDocumentsLen]["priceDiary"]){
          saveDocuments[saveDocumentsLen]["priceDiary"] = []
        }
        saveDocuments[saveDocumentsLen]["priceDiary"][days] = {}
        saveDocuments[saveDocumentsLen]["priceDiary"][days].Date = value
        // saveDocuments[saveDocumentsLen]["priceDiary"][0].Date = value.toLocaleString('ja-JP')
        // console.log(value)
        // console.log(value.toLocaleString('ja-JP'))
      }else{
        saveDocuments[saveDocumentsLen]["priceDiary"][days].open = ""
        saveDocuments[saveDocumentsLen]["priceDiary"][days].high = ""
        saveDocuments[saveDocumentsLen]["priceDiary"][days].low = ""
        saveDocuments[saveDocumentsLen]["priceDiary"][days].close = value
      }
    });
  });
  // saveDocumentsLen = -1;
  // rates.forEach((value, index, array) => {
  //   // console.log(index, index%2)
  //   if(index%2 == 0){
  //     saveDocumentsLen++;
  //     saveDocuments[saveDocumentsLen]["priceDiary"] = []
  //     saveDocuments[saveDocumentsLen]["priceDiary"][0] = {}
  //     saveDocuments[saveDocumentsLen]["priceDiary"][0].Date = value
  //     // saveDocuments[saveDocumentsLen]["priceDiary"][0].Date = value.toLocaleString('ja-JP')
  //     // console.log(value)
  //     // console.log(value.toLocaleString('ja-JP'))
  //   }else{
  //     saveDocuments[saveDocumentsLen]["priceDiary"][0].open = ""
  //     saveDocuments[saveDocumentsLen]["priceDiary"][0].high = ""
  //     saveDocuments[saveDocumentsLen]["priceDiary"][0].low = ""
  //     saveDocuments[saveDocumentsLen]["priceDiary"][0].close = value
  //   }
  // });
}