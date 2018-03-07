const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  endpoint: "http://localhost:8000"
});

let docClient = new AWS.DynamoDB.DocumentClient()
let dynamodb = new AWS.DynamoDB()

params = {
TableName: "User",
AttributeDefinitions:[
{AttributeName: "Email", AttributeType: "S"},
],
GlobalSecondaryIndexUpdates: [
{
Create: {
IndexName: "UserEmailIndex",
KeySchema: [
{AttributeName: "Email", KeyType: "HASH"}, //Partition key
],
Projection: {
"ProjectionType": "INCLUDE",
"NonKeyAttributes" : [
   "Password" ,
   "Role"
]
},
ProvisionedThroughput: {
"ReadCapacityUnits": 10,"WriteCapacityUnits": 10
}
}
}
]
};

/*
params = {
    TableName: "User",
    AttributeDefinitions:[
        {AttributeName: "Email", AttributeType: "S"},
    ],
    GlobalSecondaryIndexUpdates: [
    {
        Delete: {
            IndexName: "UserEmailIndex",
        }
    }
    ]
};
*/

dynamodb.updateTable(params, function(err, data) {
if (err)
console.log(JSON.stringify(err, null, 2));
else
console.log(JSON.stringify(data, null, 2));
});

