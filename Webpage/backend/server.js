//Name: Goh Rui ZHuo
//Admission Number:2222329
//Class: DAAA/FT/1B/05
var app = require('./controller/app');
var port = 8081;
var server = app.listen(port, function () {

    console.log('Web App Hosted at http://localhost:',port);

});
