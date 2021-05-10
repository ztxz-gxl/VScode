let express = require('express')
let bodyParser = require('body-parser')
let router = require('./router')
let settings = require('./settings'); //配置信息
let flash = require('connect-flash');
let session = require('express-session');

let app = express()

app.engine('html', require('express-art-template'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.set('views', './views')
app.use(session({
    secret: settings.cookieSecret, //加密
    key: settings.db, //cookie nam
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: true,
}))
app.use(flash())
// set flash
app.use(function (req, res, next) {
    res.locals.errors = req.flash('error')
    res.locals.infos = req.flash('info')
    next();
})

app.use(router)

app.listen(3000, () => {
    console.log('服务器启动成功')
})