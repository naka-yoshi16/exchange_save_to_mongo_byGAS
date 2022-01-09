// ============================================
// priceDiary(既存+新規)をmongoへ更新
// ============================================
function updatePriceDiary() {
  const MongoData = getMongoData();
  const SprdShtData = getSprdShtData();
  
  // 通貨ごとにループ(既存データをループ)
  for(i=0; i<MongoData.length; i++){
    // MongoDataと通貨が一致するSprdShtData(新規追加候補のデータセット)
    const newDataset = SprdShtData.find(data => data.ComparedCurrency === MongoData[i].ComparedCurrency)

    // BaseCurrencyの確認
    if(newDataset.BaseCurrency === MongoData[i].BaseCurrency){
      // 日付が一致するデータを探す(新規追加候補をループ)
      newDataset.priceDiary.forEach((newPriceDiary, index, array) => {
        // MongoDataの中からnewPriceDiaryが存在するか確認
        const existPriceDiary = MongoData[i].priceDiary.find(data => data.Date === newPriceDiary.Date.toISOString())
        // console.log(`existPriceDiary: ${JSON.stringify(existPriceDiary)}`)

        // 日付が存在しない場合(新データの場合)
        if(!existPriceDiary){
          // console.log(newDataset) // 
          // 新priceDiaryデータを追加
          MongoData[i].priceDiary.push(newPriceDiary)
        }
      })
    }
    
    //Dateの降順ソート
    MongoData[i].priceDiary.sort((a, b) => 
      new Date(b.Date).getTime() - new Date(a.Date).getTime())

    // ひと通貨ごとに保存
    update(MongoData[i])
  }
}

// ============================================
// データを更新
// ============================================
function update(updateData){
  const payload = {
    dataSource: "Cluster0",
    database  : "Exchange_Gas",
    collection: "exchange",
    filter    : { ComparedCurrency: updateData.ComparedCurrency },
    "update"  : {
        "$set": {
          "priceDiary": updateData.priceDiary,
        },          
    },
    upsert:true
  }

  // const response = UrlFetchApp.fetch(insertOneEndpoint, g_options(payload));
  const response = UrlFetchApp.fetch(updateOneEndpoint, g_options(payload));
}
