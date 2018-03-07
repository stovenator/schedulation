const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  endpoint: "http://localhost:8000"
});

let docClient = new AWS.DynamoDB.DocumentClient();


let getData = (table, keys) => {
    return docClient.get(params, function(err, data) {
        if (err) {
            //console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            return err;
        } else {
            return data;
        }
    }).promise();
}

let query = (params) => {
    return docClient.query(params, function(err, data) {
        if (err) {
            //console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            return err;
        } else {
            /*
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                console.log(" -", item.year + ": " + item.title);
            });
            */
           return data.Items;
        }
    }).promise();
}


module.exports = {
    get: getData,
    query: query
}