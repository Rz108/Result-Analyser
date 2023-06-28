//Name: Goh Rui ZHuo
//Admission Number:2222329
//Class: DAAA/FT/1B/05
var mysql = require('mysql')

var dbconnect = {
    getConnection:() =>{
        var conn = mysql.createConnection({
            host:"localhost",
            user:"bed_dvd_root",
            password:"pa$$woRD123",
            database:"bed_dvd_db",
            multipleStatements: true,
        })
        return conn
    }
}

module.exports = dbconnect