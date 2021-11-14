var Request = require('tedious').Request;
var connection = require('../store/config').dbconnection;
var utility = require('../utils/dbUtility');

function spGetExecute(qry, callback) {
    var data = [];
    var dataset = [];
    var resultset = 0;
    request = new Request(qry, function (err, rowCount) {
        utility.sendDbResponse(err, rowCount, dataset, callback);

    });

    request.on('row', function (columns) {
        utility.buildRow(columns, data);

    });

    request.on('doneInProc', function (rowCount, more, rows) {
        dataset.push(data);
        data = [];
    });

    connection.callProcedure(request);
}

function spPostExecute(qry, params, callback) {
    var newdata = [];

    request = new Request(qry, function (err, rowCount) {
        utility.sendDbResponse(err, rowCount, newdata, callback);
    });

    params.forEach(param => {

        request.addParameter(param.name, param.type, param.val);

    });

    request.on('row', function (columns) {
        utility.buildRow(columns, newdata);
    });

    connection.callProcedure(request);
}

function queryGetExecute(qry, params, isMultiSet, callback) {
    var data = [];
    var dataset = [];
    var resultset = 0;

    console.log('hi')
    request = new Request(qry, function (err, rowCount) {
        utility.sendDbResponse(err, rowCount, dataset, callback);

    });
    
    params.forEach(param => {
        request.addParameter(param.name, param.type, param.val);
    });

    request.on('row', function (columns) {
        utility.buildRow(columns, data);
    });

    request.on('doneInProc', function (rowCount, more, rows) {
        if (isMultiSet == false) {
            dataset = data;
        } else {
            dataset.push(data);
            data = [];
        }
    });

    connection.execSql(request);
}

function queryExecute(qry, params, isMultiSet, callback) {
    var data = [];
    var dataset = [];
    var resultset = 0;
   
    request = new Request(qry, function (err, rowCount) {
        // if (err) {  
        //     console.log(err);}  
        // //console.log(rowCount);
        utility.sendDbResponse(err, rowCount, data, callback);
     
        }
    );
    request.on('row', function(columns) {
        //console.log('New id: %d', columns[0].value);
          utility.buildRow(columns, data);
    });
    params.forEach(param => {
        request.addParameter(param.name, param.type, param.val);
    });
    // request.on("requestCompleted", function (rowCount, more) {
    //     connection.close();
    // });

    connection.execSql(request);
}

module.exports = {
    get: spGetExecute,
    post: spPostExecute,
    getQuery: queryGetExecute,
    query:queryExecute
};