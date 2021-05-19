let mysql = require('mysql')

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'food'
})
connection.connect()

exports.Insert = function (sqlStr, addsql, callback) {
    connection.query(sqlStr, addsql, function (err, _result) {
        if (err) {
            return callback(err)
        }
        callback(null)
    })
}

exports.Delete = function (id, tab_nanme, callback) {
    connection.query("DETELE FROM " + tab_nanme + "WHERE id = ?", id, function (err, _result) {
        if (err) {
            return callback(err)
        }
        callback(null)
    })
}

exports.Update = function (sqlStr, upSql, callback) {
    connection.query(sqlStr, upSql, function (err, _result) {
        if (err) {
            return callback(err)
        }
        callback(null)
    })
}

exports.Select = function(sqlStr,callback){
    connection.query(sqlStr, function (err, result) {
        if (err) {
            return callback(err,null)
        }
        callback(null, result)
    })
}

exports.Selects = function (sqlStr, SelectSql, callback) {
    connection.query(sqlStr, SelectSql, function (err, result) {
        if (err) {
            return callback(err,null)
        }
        callback(null, result)
    })
}