const fs = require('fs')
const AWS = require('aws-sdk')
const Papa = require('papaparse')

var args = process.argv.slice(2);
var credentials = new AWS.SharedIniFileCredentials({ profile: `${args[0]}` });

AWS.config.credentials = credentials;

const docClient = new AWS.DynamoDB.DocumentClient()
const contents = fs.readFileSync(`${args[2]}`, 'utf-8')
// If you made an export of a DynamoDB table you need to remove (S) etc from header
const data = Papa.parse(contents, { header: true, dynamicTyping: true }).data;

data.forEach((item) => {
    if (!item.maybeempty) delete item.maybeempty //need to remove empty items
    for (var prop in item) {
        if (typeof item[prop] === 'object') {// dive deeper in
            delete item[prop];
            //removeEmptyStringElements(obj[prop]);
        } else if (item[prop] === '') {// delete elements that are empty strings
            delete item[prop];
        }
    }

    docClient.put({ TableName: `${args[1]}`, Item: item }, (err, res) => {
        if (err) console.log(err)
    })
})