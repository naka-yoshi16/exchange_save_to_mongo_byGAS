// ============================================
// priceDiaryを一括削除(ブランク)
// ============================================
function deletePriceDiary(){
  const MongoData = getMongoData();

  // 通貨ごとにループ(既存データをループ)
  for(i=0; i<MongoData.length; i++){
    // 実行ログ用
    let logDeleteDate = [];
    MongoData[i].priceDiary.forEach((deletePriceDiary, index, array) => {
      logDeleteDate.push(deletePriceDiary.Date);
    })

    // priceDiaryをブランク
    // delete MongoData[i].priceDiary;
    MongoData[i].priceDiary = [];

    // ひと通貨ごとに保存
    update(MongoData[i])

    //実行ログ
    console.log(`deleteDate.length:${logDeleteDate.length}\ndeleteDate:\n${JSON.stringify(logDeleteDate,null," ")}`)
  }
}