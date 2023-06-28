let db = require('./databaseConfig');
let config = require('../config')
const jwt = require('jsonwebtoken')
let login = {
    verifyAct: function (username, password, callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            console.log(username, password)
            if (err) {//database connection gt issue!

                console.log(err);
                return callback(err, null);
            } else {

                const query = "SELECT * FROM staff WHERE email = ? AND password = ?";

                dbConn.query(query, [username, (password)], (error, results) => {
                    if (error) {
                        callback(error, null);
                        return;
                    }
                    if (results.length === 0) {
                        return callback(null, null);

                    } else {
                        const user = results[0];
                        console.log(user)
                        return callback(null, user);
                    }
                });
            }

        })
    },
    verifyCust: function (username, password, callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            console.log(username, password)
            if (err) {//database connection gt issue!

                console.log(err);
                return callback(err, null);
            } else {

                const query = "SELECT * FROM customer WHERE email = ? AND password = ?";

                dbConn.query(query, [username, (password)], (error, results) => {
                    if (error) {
                        callback(error, null);
                        return;
                    }
                    if (results.length === 0) {
                        return callback(null, null);

                    } else {
                        const user = results[0];
                        console.log(user)
                        return callback(null, user);
                    }
                });
            }

        })
    }
}

module.exports = login