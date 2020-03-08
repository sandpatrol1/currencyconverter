/******************************READ ME**********************************************************************************

Use this Google App Script to get current exhange rate and historical exchange rates to the USD.
To start you will need an API key from  https://currencylayer.com/ it's free for the
services supported on this script up to 250 calls a month.
Insert you API key in in apiKey
Get live data invoke convertUSD with arguments for currency and live convertUSD('ils', 'live')
Get historical data invoke arguments for years of data from 2001-01-01 going forward base number of years and currency
runLoopHistorical(19, 'ils')
Create a sheet called #data the historical data will be inserted here. Notice all data in #data sheet is cleared when
runLoopHistorical() is invoked.

*************************************************************************************************************************/

const apiKey = 'xxx123';
const baseCall = 'http://api.currencylayer.com/';
const dataArr = [];

// function convert both live and historical currency data on USD to one other currency 
const convertUSD = (cur, time, date) => {
  const response = date !== '' ? UrlFetchApp.fetch(baseCall + time +'?' + 'access_key=' + apiKey  + '&date=' + date + '&currencies=' + cur)
  : UrlFetchApp.fetch(baseCall + time +'?' + 'access_key=' + apiKey + '&currencies=' + cur);
  const json = JSON.parse(response);
  data(json, cur);
  return dataArr;
}

// function to push data into dataArr array
const data = ({success, timestamp, source, historical, date, quotes}, cur) => {
  if (historical === true) {
    dataArr.push([timestamp, source, date, quotes[(source + cur).toUpperCase()]]);
  }
  else dataArr.push([timestamp, source, quotes[(source + cur).toUpperCase()]]);
  return dataArr;
}

// function to get historical currency data from 2001 and years going forward until base is reached, insert currency as second argument
const runLoopHistorical = (base, cur) => {
  for (let i = 0; i < base; i++) {
    convertUSD(cur, 'historical', 2001 + i + '-01-01');
  }           
  insertData(dataArr);
}
               
// invoke functions with desired parameters                               
const runLive = () => convertUSD('ils', 'live');
const runLoopHist = () => runLoopHistorical(19, 'ils');

// function to insert historical data in sheet
const insertData = (data) => {
  const ss = SpreadsheetApp.getActive();
  const results = ss.getSheetByName('#data');
  results.clear();
  results.getRange(1, 1).setValue('Timestamp');
  results.getRange(1, 2).setValue('Source');
  results.getRange(1, 3).setValue('Date');
  results.getRange(1, 4).setValue('Quote');
  let lastRow = results.getLastRow() + 1;
  console.log(dataArr[0]);
  results.getRange(lastRow, 1, dataArr.length, 4).setValues(dataArr);   
}              

 
              
