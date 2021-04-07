var express = require('express');
var router = express.Router();
const { GoogleSpreadsheet } = require('google-spreadsheet');

let infoArray

async function sheet(data){
  const creds = require('./client_secret.json');
  const doc = new GoogleSpreadsheet('1UXFqx0MCXuStZe1O8QAtFwbpQpQNvbIrbWgxBGwkdEo');
  await doc.useServiceAccountAuth(creds);

  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);

  const sheet = doc.sheetsByIndex[1]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  await sheet.loadCells();
  console.log(sheet.cellStats)
  let cellB2 = sheet.getCellByA1('B2')
  let cellA2 = sheet.getCellByA1('A2')
  console.log(data)
  console.log('CellB2')
  console.log(cellB2.value)
  cellA2.value = parseInt(data.income)
  await sheet.saveUpdatedCells()
  await sheet.loadCells();
  console.log(cellB2.value);
  infoArray = [[cellB2.value]]
  // console.log(sheet.title);
  // console.log(sheet.rowCount);
  // const rows = await sheet.getRows(); // can pass in { limit, offset }
  // console.log(rows[1]['2010'])
}

async function loadTable(data){
  infoArray = []
  const creds = require('./client_secret.json');
  const mainDoc = new GoogleSpreadsheet('1UXFqx0MCXuStZe1O8QAtFwbpQpQNvbIrbWgxBGwkdEo');
  await mainDoc.useServiceAccountAuth(creds);

  await mainDoc.loadInfo(); // loads document properties and worksheets
  console.log(mainDoc.title);

  const sheet = mainDoc.sheetsByIndex[2]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  await sheet.loadCells();
  console.log(sheet.cellStats)
  console.log(sheet.title)

  let rows = await sheet.getRows()
  console.log(rows.length)
  for(let i = 0;i<rows.length;i++){
    let row = rows[i]
    if(row.sheetID != null){
      infoArray.push({benefit:row.Benefit,id:row.sheetID})
      console.log(row.Benefit + '\\' + row.sheetID)
    }
  }
  console.log('Inside Function')
  console.log(infoArray)
}

  /* GET users listing. */
router.get('/', async function(req, res, next) {
  queryStr = req.query
  //sheet(queryStr)
  await loadTable(queryStr)
  //res.sendFile('charts.html', { root: __dirname });
  res.render('report',{infoArray})
  //res.render('charts.html')
  //res.render(__dirname + "/views/charts.html", {name:queryStr});
});

module.exports = router;
