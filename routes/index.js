var express = require('express');
var router = express.Router();
var Moment = require('moment-timezone');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
var scanResponse = {};

//AWS
var docClient = new AWS.DynamoDB.DocumentClient();

//AWS

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/viewRecords.html', function(req, res, next) {
  scan(res);
	var records = {
		records : [{
			key: "123123",
			fName: "Will",
			icecream: "Vanilla",
			animals: ['bear', 'dog'],
			email: 'wmai.gom',
			website: 'google.com'
			},
      {
			key: "123123",
			fName: "Will",
			icecream: "Vanilla",
			animals: ['bear', 'dog'],
			email: 'wmai.gom',
			website: 'new'
			}
               ]
    
	}
  //res.render('viewRecords', records);
});


	
router.post('/newRecord', function(req, res, next){
  put(req.body, res);
	console.log(req.body);
	

	
});

router.post('/deleteRecord', function(req, res, next){
	console.log(req.body.recordNumber);
  deleteRecord(req.body.recordNumber, res);
  
	
});

router.post('/updateRecord', function(req, res, next){
	console.log("Updating with this data:") 
  console.log(req.body);
  update(req.body, res);
  
	
});

function scan(res){
  params = {TableName:"records"};
	console.log("Scanning Records table.");
  var items = docClient.scan(params, function(err, data){
   // console.log(data.Items);

 /*   for (var record in data.Items){  //Stupid stuff becuase jade won't coorporate
      console.log(data.Items);
      data.Items[record].animals = data.Items[record]['animals[]'];
    }*/
    var records = { "records" : data.Items};

    console.log(records);//['animals[]']);
    res.render('viewRecords', records)
  });
  
  
	
  
}

function put(body, res){
  var animals = body['animals[]'];
  body.animals = animals;
  delete body['animals[]'];
	var params = {
		TableName: "records",
		Item : body
	}

	var date = new Date();
	var id = date.getTime();
	body['recordNumber'] = id;
	
	docClient.put(params, function(err, data) {
		if (err) {
			console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
		} else {
			console.log("Added item:", JSON.stringify(data, null, 2));
			res.send({'success':true});
		}
	})
		
}


function onScan(err, data, res) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Scan succeeded.");
        scanReponse = data.Items;
        data.Items.forEach(function(record) {
          // console.log(
            //    "Icecream: " + record.icecream + "\nAnimals: " + record.animals);
        });

        // continue scanning if we have more movies
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
}
function get(key){
	var params = {
		TableName: "records",
		Key: {
			"recordNumber": key
		}
	};
	docClient.get(params, function(err, data) {
		if (err) {
			console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
		} else {
			console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
		}
	});
}

function update(body, res){
  console.log("****");
  console.log(body);
  console.log("****");
  console.log(body.fName);
    console.log("****");
	var params = {
		TableName:"records",
		Key:{
			"recordNumber": Number(body.recordNumber)
		},
		UpdateExpression: "set icecream = :i, animals=:a, fName=:n, website=:w,  email=:e",
		ExpressionAttributeValues:{
			":i": body.icecream,
			":a": body['animals[]'],
			":n": body.fName,
			":w": body.website,
			":e": body.email
		},
		ReturnValues:"UPDATED_NEW"
	};

	console.log("Updating the item...");
	docClient.update(params, function(err, data) {
		if (err) {
			console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
		} else {
			console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
      res.send({'success':true});
		}
	});
}
	
function deleteRecord(key, res){
  console.log(res);
	var params = {
	TableName: "records",
	Key: {
		"recordNumber": Number(key)
		}
	};
	console.log("Attempting a conditional delete...");
  console.log(params);
	docClient.delete(params, function(err, data) {
		if (err) {
			console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
		} else {
			  console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        res.send({'success':true});
		}
	});
}

function query(conditions){
  var params = {
      TableName : "records",
      KeyConditionExpression: "table: records",
  };

  docClient.query(params, function(err, data) {
      if (err) {
          console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
          console.log("Query succeeded.");
          data.Items.forEach(function(item) {
              console.log(" -", item.icecream + ": " + item.fName
              + " ... " + item.animals[0]
              + " ... " + item.website);
          });
      }
  });
}


module.exports = router;
