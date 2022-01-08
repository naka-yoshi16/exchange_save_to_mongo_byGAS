function myFunction() {
  const MongoData = getMongoData();
  const SprdShtData = getSprdShtData();
  // console.log(`MongoData:\n${JSON.stringify(MongoData, null ," ")}`)
  // console.log(`SprdShtData:\n${JSON.stringify(SprdShtData, null ," ")}`)
  

  // 通貨ごとにループ
  for(i=0; i<MongoData.length; i++){
    // console.log(MongoData[i])

    // MongoDataと通貨が一致するSprdShtData(新規追加候補のデータセット)
    const newDataset = SprdShtData.find(data => data.ComparedCurrency === MongoData[i].ComparedCurrency)

    // BaseCurrencyの確認
    if(newDataset.BaseCurrency === MongoData[i].BaseCurrency){
      // 日付が一致するデータを探す
      newDataset.priceDiary.forEach((newPriceDiary, index, array) => {
        // MongoDataの中からnewPriceDiaryが存在するか確認
        const existPriceDiary = MongoData[i].priceDiary.find(data => data.Date === newPriceDiary.Date.toISOString())
        // console.log(`existPriceDiary: ${JSON.stringify(existPriceDiary)}`)

        // 日付が存在しない場合(新データの場合)
        if(!existPriceDiary){
          console.log(newDataset) // 
          // console.log(`existPriceDiary: ${JSON.stringify(existPriceDiary)}`)
          // console.log(`newPriceDiary.Date:${JSON.stringify(newPriceDiary.Date)}`)

          // 新priceDiaryデータを追加
          // console.log(`before   MongoData[i].priceDiary:${JSON.stringify(MongoData[i].priceDiary,null, " ")}`)
          MongoData[i].priceDiary.push(newPriceDiary)
          // console.log(`after   MongoData[i].priceDiary:${JSON.stringify(MongoData[i].priceDiary,null, " ")}`)
        }
      })
    }
  }


  // ひと通貨ごとに保存
  for(i=0; i<MongoData.length; i++){
    const payload = {
      dataSource: "Cluster0",
      database: "Exchange_Gas",
      collection: "exchange",
      filter: { ComparedCurrency: MongoData[i].ComparedCurrency },
      "update": {
          "$set": {
          // "$setOnInsert": {
          // "$upsert": {
              // "priceDiary": [0,1,2],
              "priceDiary": MongoData[i].priceDiary,
              // "completedAt": { "$date": { "$numberLong": "1637083942954" } }
          },          
      },
      upsert:true
    }

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      // headers: { "api-key": apikey }
      headers: { "api-key": getAPIKey() }
    };

    // const response = UrlFetchApp.fetch(insertOneEndpoint, options);
    const response = UrlFetchApp.fetch(updateOneEndpoint, options);
  }
}
