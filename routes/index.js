var express = require('express');
var router = express.Router();

const { GoogleSpreadsheet } = require('google-spreadsheet');
let infoArray =[]

async function sheet(){
  const doc = new GoogleSpreadsheet('1UXFqx0MCXuStZe1O8QAtFwbpQpQNvbIrbWgxBGwkdEo');
  const creds = require('./client_secret.json');
  await doc.useServiceAccountAuth(creds);

  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);

  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  console.log(sheet.title);

  const rows = await sheet.getRows(); // can pass in { limit, offset }
  let rowCount = rows.length
  infoArray = []
  for(let i = 0;i < rowCount; i++){
      infoArray.push(rows[i].Item)
  }
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  await sheet()
  //let infoArray = ['Drale','Dd']
  
  //res.render('index', { title: 'Express' });
  //res.sendFile('index.html', { root: __dirname });
  console.log(infoArray)
  res.render('home',{infoArray})
});

module.exports = router;
