# dynamodb-csv-importer
Simple set of scripts to import data into DynamoDB

Currently requires the environment variable `AWS_SDK_LOAD_CONFIG` to be set to true, in order to load region etc. from configs.

Call using:

```
node index.js <AWS profile> <table name> <Location of CSV>
```
