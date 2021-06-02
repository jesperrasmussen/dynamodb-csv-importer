const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const fs = require('fs')
const Papa = require('papaparse')
const { fromSSO } = require('@aws-sdk/credential-provider-sso')

var args = process.argv.slice(2);
var credentials = fromSSO({ profile: `${args[0]}` });

const client = new DynamoDBClient({ credentials });
const ddbDocClient = DynamoDBDocument.from(client);

const contents = fs.readFileSync(`${args[2]}`, 'utf-8')
// If you made an export of a DynamoDB table you need to remove (S) etc from header
const data = Papa.parse(contents, { header: true, dynamicTyping: false }).data;

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

    ddbDocClient.put({
        TableName: `${args[1]}`,
        Item: item
    }, (err, res) => {
        if (err) console.log(err)
    });
})