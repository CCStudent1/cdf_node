var express = require('express');
var router = express.Router();
const { GoogleSpreadsheet } = require('google-spreadsheet');

/* Stubbing in Database Table
  Example:

  CAL_FRESH_TABLE
      index     household_sizes
    | county  |       1       |        2       |        3        |
    | alameda | '671_873_115' | '905_1176_212' | '1138_1479_304' |

*/
// var sampleTableQuery = {
//   'alameda': {
//     1: '671_873_115',
//     2: '905_1176_212',
//     3: '1138_1479_304'
//   }
// }

// // parameters from post? request
// var sampleParams = {
//   'county': 'alameda',
//   'household_size': 3,
//   'net_income': 900,
//   'gross_income': 1100,
//   'guaranteed_income': 0
// }

// /* POST form into report. */
// router.post('/', function(req, res, next) {
//   const formParams = req.body
//   console.log('REQ: ', formParams)

//   household_size = formParams['household_size']
//   if (household_size > 0 || household_size < 4) {
//     var query = sampleTableQuery['alameda'][household_size]
//     var splitQuery = query.split('_')

//     resParams = {
//       'input': formParams,
//       'program_info': {
//         'cal_fresh': {
//           'max_net_income': splitQuery[0],
//           'max_gross_income': splitQuery[1],
//           'max_allotment': splitQuery[2]
//         }
//       }
//     }


//     console.log(resParams)

//     res.render('report', resParams);
//   } else {
//     res.render('report', { error: True});
//   }

async function sheet(){
  const creds = require('./client_secret.json');
  const doc = new GoogleSpreadsheet('1VxtVrw7sEMXV2CJAKvWWB-jPSsHGU7mJpt0IaPUiuP8');
  await doc.useServiceAccountAuth(creds);

  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);

  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  console.log(sheet.title);
  console.log(sheet.rowCount);
  const rows = await sheet.getRows(); // can pass in { limit, offset }
  console.log(rows[1]['2010'])
}

  /* GET users listing. */
router.get('/', function(req, res, next) {
  queryStr = req.query
  sheet()
  res.sendFile('charts.html', { root: __dirname });
  //res.render('charts.html')
  //res.render(__dirname + "/views/charts.html", {name:queryStr});
});

module.exports = router;
