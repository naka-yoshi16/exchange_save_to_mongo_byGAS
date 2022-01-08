// const findEndpoint = 'https://data.mongodb-api.com/app/data-whorv/endpoint/data/beta/action/find';

// ============================================
// mongoの保存済データを取得  
// ============================================
function getMongoData() {
// https://docs.atlas.mongodb.com/api/data-api-resources/#find-multiple-documents
  const payload = {
      "dataSource": "Cluster0",
      "database": "Exchange_Gas",
      "collection": "exchange",
      // "filter": {"ComparedCurrency": "AUD"}//<query filter>,
      // "projection": <projection>,
      // "sort": <sort expression>,
      // "limit": 2, //<number>,
      // "skip": <number>
  }

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    headers: { "api-key": getAPIKey() }
  };

  const response = UrlFetchApp.fetch(findEndpoint, options);
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
 const sheet = activeSheetsApp.getSheets()[3];
 const BaseCurrency = sheet.getRange("B2").getValue();

 const getSprdShtData = [];
 const ComparedCurrencies = [];
 const rates = [];

  //  現在のデータを取得
  const getDocuments = sheet.getRange(`B4:S7`).getValues();
  // console.log(getDocuments)

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
  // console.log(JSON.stringify(getSprdShtData))
  return getSprdShtData
}