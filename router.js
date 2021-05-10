let express = require('express')
let router = express.Router()
let sql = require('./db')
let ver = require('./verification')

router.get('/', function (_req, res) {
    res.render('resg.html')
})

router.get('/login', function (_req, res) {
    res.render('login.html')
})

router.post('/login', function (req, res) {
    let body = req.body
    if(body.code === req.session.code){
    let sqlStr = 'SELECT * FROM demo '
    sql.Select(sqlStr, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message)
            return
        }
        // res.send(result)
        let ok = false
        for(i of result){
            if (i.useName === body.useName && i.name === body.name) {
                ok = false
                break
            } else {
                ok = true
            }
        
        }
        if (ok) {
            let addSql = 'INSERT INTO demo VALUES(null,?,?,?,?)'
            let addSqlParams = [body.useName, body.name, body.password,body.email]
            sql.Insert(addSql, addSqlParams, function (err) {
                if (err) {
                    console.log('[INSERT ERROR] - ', err.message)
                    return
                }
                res.render('login.html')
            })
        } else {
            req.flash('error','该用户已存在')
            res.redirect('/')
        }
    })
}else{
    req.flash('error','验证码错误')
    res.redirect('/')
}
})

router.post('/show', function (req, res) {
    let body = req.body
    let sqlStr = 'SELECT * FROM demo '
    sql.Select(sqlStr, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message)
            return
        }
        let ok = false
        for(i of result){
            if (i.useName === body.userName && i.name === body.name && i.password === body.password) {
                ok = true
                break
            } else {
                ok = false
            }
        }
        if (ok) {
            res.render('show.html', {
                userName: body.userName,
                name: body.name,
                password: body.password
            })
        } else {
            res.setHeader('Content-Type', 'text/HTML;charset=utf-8')
            res.end('<h1><a href = "/login">输入信息有误!点击重新登录</a></h1>')
        }
    })
})

router.post('/sendEmail',function(req,res){
     ver.Send(req.body.email,function(code){
         req.session.code = code
         res.send({text:'验证码发送成功'})
     })
})

module.exports = router