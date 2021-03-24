var express = require('express');
var router = express.Router();


/* Stubbing in Database Table
  Example:

  CAL_FRESH_TABLE
      index     household_sizes
    | county  |       1       |        2       |        3        |
    | alameda | '671_873_115' | '905_1176_212' | '1138_1479_304' |

*/
var sampleTableQuery = {
  'alameda': {
    1: '671_873_115',
    2: '905_1176_212',
    3: '1138_1479_304'
  }
}

// parameters from post? request
var sampleParams = {
  'county': 'alameda',
  'household_size': 3,
  'net_income': 900,
  'gross_income': 1100
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  household_size = sampleParams['household_size']
  if (household_size > 0 || household_size < 4) {
    var query = sampleTableQuery['alameda'][household_size]
    var splitQuery = query.split('_')

    resParams = {
      'input': sampleParams,
      'program_info': {
        'cal_fresh': {
          'max_net_income': splitQuery[0],
          'max_gross_income': splitQuery[1],
          'max_allotment': splitQuery[2]
        }
      }
    }

    console.log(resParams)

    res.render('report', resParams);
  } else {
    res.render('report', { error: True});
  }


  // queryStr = req.query
  // res.sendFile('charts.html', { root: __dirname });
  //res.render('charts.html')
  //res.render(__dirname + "/views/charts.html", {name:queryStr});
});

module.exports = router;
