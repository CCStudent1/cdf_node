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
  let fr = form_response
  let houseHoldSize = (1 * fr.num_children_under_1) + (1 *  fr.num_children_under_6) + (1 * fr.num_children_under_18) + 1 * fr.other_dependents
  let grossIncome = (1*fr.gross_income) + ( 1* fr.other_income)
  let foodCost = fr.food * 1
  let healthCareCost = fr.healthcare * 1
  let rentCost = fr.rent * 1
  let childCareCost = fr.childcare
  let transportationCost = fr.transportation
  for(let i = 0;i<rows.length;i++){
    let row = rows[i]
    if(row.Ready == 1){
      console.log(row.Benefit + '\\' + row.sheetID)
        console.log('Update Sheet')
        let benefitDoc = new GoogleSpreadsheet(row.sheetID)
        await benefitDoc.useServiceAccountAuth(creds)
        await benefitDoc.loadInfo()
        let houseHoldSheet = benefitDoc.sheetsByIndex[1]
        await houseHoldSheet.loadCells()
        await updateCell(houseHoldSheet,'B3',grossIncome)//Update Income
        await updateCell(houseHoldSheet,'B9',houseHoldSize)//Update Household Size
        await updateCell(houseHoldSheet, 'B11',rentCost)
        await updateCell(houseHoldSheet,'B12',childCareCost)
        await updateCell(houseHoldSheet,'B14',foodCost)
        await updateCell(houseHoldSheet,'B15',healthCareCost)
        await updateCell(houseHoldSheet,'B16',transportationCost)

        let calcSheet = benefitDoc.sheetsByIndex[2]
        await calcSheet.loadCells()
        infoArray.push({benefit:row.Benefit,id:row.sheetID,allotment: getCellValue(calcSheet,'B2')})  
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

router.post('/', async function(req, res, next) {
  infoArray = []
  form_response = JSON.parse(JSON.stringify(req.body));
  console.log(form_response)
  await loadTable(form_response)
  res.render('report',{infoArray})
});


module.exports = router;
