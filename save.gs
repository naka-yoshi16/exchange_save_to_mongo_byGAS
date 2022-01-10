// ============================================
// priceDiary(既存+新規)をmongoへ更新
// ============================================
function updatePriceDiary() {
  const MongoData = getMongoData();
  const SprdShtData = getSprdShtData();
  
  // 通貨ごとにループ(既存データをループ)
  for(i=0; i<MongoData.length; i++){
    // 実行ログ用
    pushDate = []; // 追加した日時
    modifyData = []; // 修正したデータ(修正前)(修正後はDBに反映されているため、ログには出さない)

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
          MongoData[i].priceDiary.push(newPriceDiary) // 新priceDiaryデータを追加
          
          //実行ログ用
          pushDate.push(newPriceDiary.Date.toISOString())
        }else{ // 日付が一致の場合
          // 既存データと新規データに差異がある場合
          if( existPriceDiary.close !== newPriceDiary.close
          //  || existPriceDiary.open  !== newPriceDiary.open
          //  || existPriceDiary.high  !== newPriceDiary.high
          //  || existPriceDiary.close !== newPriceDiary.low
           ){
            // 差異ありのMongoData.priceDiaryを洗い替え
            MongoData[i].priceDiary.forEach((MngData,index) => { // 既存priceDiaryをループ
              if(MngData.Date === newPriceDiary.Date.toISOString()) { // 既存priceDiaryの日時と新規データの日時の比較
              　// 差異ありのMongoData.priceDiaryを削除
                const oldPriceDiary = MongoData[i].priceDiary.splice(index, 1)
                
                //実行ログ用
                modifyData.push(oldPriceDiary)
              }
            })
            // 新priceDiaryデータを追加
            MongoData[i].priceDiary.push(newPriceDiary)
          }
        }
      })
    }
    
    //Dateの降順ソート
    MongoData[i].priceDiary.sort((a, b) => 
      new Date(b.Date).getTime() - new Date(a.Date).getTime())

    // ひと通貨ごとに保存
    update(MongoData[i])
    //実行ログ
    if(pushDate.length !=0 || modifyData.length != 0){
      console.log(` pushDate.length:${pushDate.length} modifyData.length:${modifyData.length}\n pushDate:\n${JSON.stringify(pushDate,null," ")}\n modifyData:\n${JSON.stringify(modifyData, null, " ")}`)
    }
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
  // 実行ログ
  console.log(`update:${updateData.ComparedCurrency}/${updateData.BaseCurrency}  ${response}  priceDiary.length=${updateData.priceDiary.length}`)
}


// ============================================
// !注意　普段は使わない想定! 新規データを保存 
// ============================================
function newSaveData(){
  const SprdShtData = getSprdShtData();

  // 通貨ごとにループ(既存データをループ)
  for(i=0; i<SprdShtData.length; i++){
    // ひと通貨ごとに保存
    update(SprdShtData[i])
  }
}