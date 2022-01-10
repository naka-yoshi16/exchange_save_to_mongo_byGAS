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
// https://uxmilk.jp/25841
 const activeSheetsApp = SpreadsheetApp.getActiveSpreadsheet();
//  const sheet = activeSheetsApp.getSheets()[3];
 const sheet = activeSheetsApp.getSheets()[2];
 const BaseCurrency = sheet.getRange("B2").getValue();

 const ComparedCurrencies = []; // 通貨情報の格納用
 const DateRates = []; // 日時, レートの格納用
 const saveDocuments = []; // mongoへ保存する形式の格納用

  //  現在の(指定範囲)データを取得
  // const getSheetData = sheet.getRange(`B4:S7`).getValues();
  const getSheetData = sheet.getRange(`B4:S37`).getValues();
  // console.log(getSheetData)

  // 取得したシートデータから比較通貨とレートへ分割 divideData(getSheetData, ComparedCurrencies, DateRates)
  divideData(getSheetData, ComparedCurrencies, DateRates)
  // console.log(ComparedCurrencies)
  // console.log(DateRates)

  // 比較通貨とレートを整形
  // console.log(saveDocuments)
  // 通貨を格納 
  mapCurrencies(BaseCurrency, ComparedCurrencies, saveDocuments)
  // console.log(saveDocuments)

  // 日付、レートを格納 
  mapDateRates(DateRates, saveDocuments)
  // console.log(JSON.stringify(saveDocuments))

  return saveDocuments
}

// ============================================ 
// 比較通貨とレートを抽出
// ============================================ 
function divideData(getSheetData, ComparedCurrencies, DateRates) {
  // 取得データをループ
  for (d = 1; d <= getSheetData.length; d++) {
    const row = getSheetData[d - 1] // 行を格納
    const item = row[0] // 行の先頭
    //  console.log(item)
    switch (item) { // 行の先頭により処理変更
      case 'Compared Currency':
        // console.log('a')
        row.forEach((value, index, array) => {
          if(index == 0) value = "";
          ComparedCurrencies.push(value)
        });
        break;
      case 'line': // 何もしない
        break;
      case 'Date': // 何もしない
        break;
      default:
        let ratesOneday = []; // 各セルデータ格納用
        row.forEach((value, index, array) => {
          ratesOneday.push(value) // セル(日時, レート, 日時, ...)ごとにpush
        });
        // 日付(行)ごとにpush
        DateRates.push(ratesOneday)
    } 
  //  console.log(ComparedCurrencies)
  //  console.log(DateRates)
  }
}

// ============================================ 
// 通貨を格納 
// ============================================ 
function mapCurrencies(BaseCurrency, ComparedCurrencies, makeCurrData) {
  currSrlNum = -1; // 通貨(切り替え用)連番
  ComparedCurrencies.forEach((value, index, array) => {
    // console.log(index, index%2)
    if(index%2 == 0){
      makeCurrData.push({}) // 通貨ごとのobject枠作成
      currSrlNum++; // 通貨切り替え
      // makeCurrData[currSrlNum].BaseCurrency = BaseCurrency
      makeCurrData[currSrlNum]["BaseCurrency"] = BaseCurrency
    }else{
      // makeCurrData[currSrlNum].ComparedCurrency = value
      makeCurrData[currSrlNum]["ComparedCurrency"] = value
    }
  });
}

// ============================================ 
// 日付、レートを格納 
// ============================================ 
function mapDateRates(DateRates, makeDateRates){
  // 日付(行)ごとにループ
  DateRates.forEach((ratesOneday, days, array) => {
    currSrlNum = -1; // 通貨(切り替え用)連番
    // 日時、レート(セル)ごとにループ
    ratesOneday.forEach((value, index, array) => {
      if(index%2 == 0){ // index=偶数の場合→日時を格納
        currSrlNum++; // 通貨切り替え
        if(!makeDateRates[currSrlNum]["priceDiary"]){
          makeDateRates[currSrlNum]["priceDiary"] = [] // priceDiaryのArray枠作成
        }
        makeDateRates[currSrlNum]["priceDiary"][days] = {} // priceDiaryの日付ごとのObj枠作成
        makeDateRates[currSrlNum]["priceDiary"][days].Date = value
        // makeDateRates[currSrlNum]["priceDiary"][0].Date = value.toLocaleString('ja-JP')
        // console.log(value)
        // console.log(value.toLocaleString('ja-JP'))
      }else{ // index=奇数の場合→レートを格納
        makeDateRates[currSrlNum]["priceDiary"][days].open = ""
        makeDateRates[currSrlNum]["priceDiary"][days].high = ""
        makeDateRates[currSrlNum]["priceDiary"][days].low = ""
        makeDateRates[currSrlNum]["priceDiary"][days].close = value
      }
    });
  });
}