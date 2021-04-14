var express = require('express');
var router = express.Router();
const { GoogleSpreadsheet } = require('google-spreadsheet');

var infoArray
var benefitTable

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

async function updateCell(sheet,cellID,value){
  let cell = sheet.getCellByA1(cellID)
  console.log(cell.value)
  cell.value = parseInt(value)
  await sheet.saveUpdatedCells()
  await sheet.loadCells();
}

function getCellValue(sheet,cellID){
  let cell = sheet.getCellByA1(cellID)
  return parseInt(cell.value)
}

async function loadTable(data){
  infoArray = []
  benefitTable = []
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
      console.log(row.Benefit + '\\' + row.sheetID)
      if(row.Benefit=='CalFresh'){
        console.log('Update Sheet')
        let benefitDoc = new GoogleSpreadsheet(row.sheetID)
        await benefitDoc.useServiceAccountAuth(creds)
        await benefitDoc.loadInfo()
        let houseHoldSheet = benefitDoc.sheetsByIndex[1]
        await houseHoldSheet.loadCells()
        
        await updateCell(houseHoldSheet,'B3',200)//Update Income
        await updateCell(houseHoldSheet,'B9',3)//Update Household Size
        let calcSheet = benefitDoc.sheetsByIndex[2]
        await calcSheet.loadCells()
        infoArray.push({benefit:row.Benefit,id:row.sheetID,allotment: getCellValue(calcSheet,'B2')})  
        continue
      }
      infoArray.push({benefit:row.Benefit,id:row.sheetID,allotment:0})
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
