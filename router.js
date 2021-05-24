let express = require('express')
let sd = require('silly-datetime')
let crypto = require('crypto')
let fs = require('fs')
let Formidable = require('formidable')
let router = express.Router()
let sql = require('./db')
let ver = require('./verification')
const { LOADIPHLPAPI } = require('dns')

router.get('/resg', function (_req, res) {
    res.render('resg.html')
})

router.get('/login', function (_req, res) {
    res.render('login.html')
})

router.get('/about', function (_req, res) {
    res.render('about.html')
})

router.get('/back/main', function (_req, res) {
    res.render('backLogin.html')
})

router.get('/back/resg', function (_req, res) {
    res.render('backResg.html')
})

router.get('/back', function (req, res) {
    sql.Selects('SELECT useName,imgAddr FROM seller WHERE id = ?', req.query.userid, function (err, result) {
        if (err) {
            console.log(err);
            return

        }
        sql.Select('SELECT id,`order` FROM click limit 8 ', function (err, result2) {
            if (err) {
                console.log(err);
                return

            }
            sql.Select('SELECT * FROM feedback limit 8', function (err, result3) {
                if (err) {
                    console.log(err);
                    return

                }
                res.render('back.html', {
                    userid: req.query.userid,
                    orderID: result2[0].id,
                    imgAddr: result[0].imgAddr,
                    useName: result[0].useName,
                    click: result2,
                    feedback: result3
                })
            })
        })
    })
})

router.get('/back/showMenu', function (req, res) {
    sql.Select('SELECT * FROM menu', function (err, result) {
        if (err) {
            console.log('select is fail' + err)
            return
        }

        let array = result
        let index = 0;
        let newArray = [];
        while (index < array.length) {
            newArray.push(array.slice(index, index += parseInt(Array.from(result).length / 3)));
        }
        if (newArray.length === 3) {
            newArray = newArray
        }
        else if (newArray[3].length === 1) {
            newArray[0] = newArray[0].concat(newArray[3])
        } else if (newArray[3].length === 2) {
            newArray[0] = newArray[0].concat(newArray[3][0])
            newArray[1] = newArray[1].concat(newArray[3][1])
        }
        res.render('showMenu.html', {
            userid: req.query.userid,
            menu1: newArray[0],
            menu2: newArray[1],
            menu3: newArray[2]
        })
    })
})

router.get('/beef', function (req, res) {
    sql.Selects('SELECT * FROM menu WHERE soft = ?', '牛肉面、粉', function (err, result) {
        if (err) {
            console.log(err);
            return
        }
        res.render('beef.html', {
            userid: req.query.userid,
            showMenu: result
        })
    })
})

router.get('/click', function (req, res) {
    sql.Select('SELECT * FROM menu', function (err, result) {
        if (err) {
            console.log('select is fail' + err)
            return
        }

        let array = result
        let index = 0;
        let newArray = [];
        while (index < array.length) {
            newArray.push(array.slice(index, index += parseInt(Array.from(result).length / 3)));
        }
        if (newArray.length === 3) {
            newArray = newArray
        }
        else if (newArray[3].length === 1) {
            newArray[0] = newArray[0].concat(newArray[3])
        } else if (newArray[3].length === 2) {
            newArray[0] = newArray[0].concat(newArray[3][0])
            newArray[1] = newArray[1].concat(newArray[3][1])
        }
        res.render('click.html', {
            userid: req.query.userid,
            menu1: newArray[0],
            menu2: newArray[1],
            menu3: newArray[2]
        })
    })
})

router.get('/contact', function (req, res) {
    res.render('contact.html', {
        userid: req.query.userid
    })
})

router.get('/drink', function (req, res) {
    sql.Selects('SELECT * FROM menu WHERE soft = ?', '饮料', function (err, result) {
        if (err) {
            console.log(err);
            return
        }
        res.render('drink.html', {
            userid: req.query.userid,
            showMenu: result
        })
    })
})

router.get('/', function (_req, res) {
    res.render('main.html')
})

router.get('/index', function (req, res) {
    res.render('index.html', { userid: req.query.userid })
})

router.get('/nood', function (req, res) {
    sql.Selects('SELECT * FROM menu WHERE soft = ?', '素菜配菜面、粉', function (err, result) {
        if (err) {
            console.log(err);
            return
        }
        res.render('nood.html', {
            userid: req.query.userid,
            showMenu: result
        })
    })
})

router.get('/other', function (req, res) {
    sql.Selects('SELECT * FROM menu WHERE soft = ?', '其他', function (err, result) {
        if (err) {
            console.log(err);
            return
        }
        res.render('other.html', {
            userid: req.query.userid,
            showMenu: result
        })
    })
})

router.get('/owen', function (req, res) {
    sql.Selects('SELECT c.id,`order`,useName,c.createTime,imgAddr FROM click c INNER JOIN `user` u on u.id = c.userid WHERE u.id = ?', req.query.userid, function (err, result) {
        if (err) {
            console.log('select is fail ' + err);
            return
        }
        res.render('owen.html', {
            userid: req.query.userid,
            imgAddr: result[0].imgAddr,
            name: result[0].useName,
            grwz: result
        })
    })
})

router.get('/back/showFeed', function (req, res) {
    sql.Selects('SELECT * FROM feedback', function (err, result) {
        res.render('showFeed.html', {
            userid: req.query.userid,
            feed: result[0].feed,
            createTime: result[0].createTime,
            phone: result[0].phone,
            email: result[0].email,
            id: result[0].id

        })
    })

})

router.get('/back/addMenu', function (req, res) {
    res.render('addMenu.html', {
        userid: req.query.userid
    })
})

router.get('/back/upMenu', function (req, res) {
    sql.Selects('SELECT * FROM menu WHERE id = ?', req.query.id, function (err, result) {
        if (err) {
            console.log('select is faild' + err);
            return
        }
        res.render('upMenu.html', {
            userid: req.query.userid,
            id: result[0].id,
            soft: result[0].soft,
            menuName: result[0].menuName,
            introduce: result[0].introduce,
            price: result[0].price
        })
    })
})

router.get('/back/delMenu', function (req, res) {
    sql.Delete(req.query.id, 'menu', function (err) {
        if (err) {
            console.log('delete is faild' + err)
            return
        }
        res.redirect('/back/showMenu?userid=' + req.query.userid)
    })
})

router.get('/del', function (req, res) {
    sql.Delete(req.query.orderID, 'click', function (err) {
        if (err) {
            console.log('delete is faild' + err);
            return
        }
        res.redirect('/owen?userid=' + req.query.userid)
    })
})

router.get('/back/del', function (req, res) {
    sql.Delete(req.query.orderID, 'click', function (err) {
        if (err) {
            console.log('delete is faild' + err)
            return
        }
        res.redirect('/back?userid=' + req.query.userid)
    })
})

router.get('/back/delFeed', function (req, res) {
    sql.Delete(req.query.ID, 'feedback', function (err) {
        if (err) {
            console.log('delete is faild' + err)
            return
        }
        res.redirect('/back?userid=' + req.query.userid)
    })
})

router.get('/showOrderMain', function (req, res) {
    sql.Selects('SELECT `order`,`all`,createTime FROM click WHERE id = ?', req.query.orderID, function (err, result) {
        if (err) {
            console.log('SELECT is fail' + err);
            return
        }
        res.render('showOrderMain.html', {
            userid: req.query.userid,
            id: req.query.orderID,
            order: result[0].order,
            createTime: result[0].createTime,
            all: result[0].all
        })
    })
})

router.get('/back/addimg', function (req, res) {
    sql.Selects('SELECT * FROM menu WHERE id = ?', req.query.id, function (err, result) {
        res.render('addimg.html', {
            userid: req.query.userid,
            id: req.query.id,
            imgUrl: result[0].imgUrl
        })
    })
})

router.get('/back/showOrder', function (req, res) {
    sql.Selects('SELECT `order`,`all`,createTime FROM click WHERE id = ?', req.query.orderID, function (err, result) {
        if (err) {
            console.log('SELECT is fail' + err);
            return
        }
        res.render('showOrder.html', {
            userid: req.query.userid,
            id: req.query.orderID,
            order: result[0].order,
            createTime: result[0].createTime,
            all: result[0].all
        })
    })
})

router.post('/downClick', function (req, res) {
    sql.Selects('SELECT id,price,menuName FROM menu', function (err, result) {
        if (err) {
            console.log('SELECT is fail' + err);
            return
        }
        let all = 0.0
        let order = ""
        for (i of result) {
            for (o of JSON.parse(req.body.data)) {
                if (parseInt(i.id) === parseInt(o.id)) {
                    all += parseFloat(i.price) * parseFloat(o.num)
                    order += (i.menuName + "x" + o.num + " ")
                }
            }
        }
        let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
        sql.Insert('INSERT INTO click(userid,`order`,`all`,createTime) values(?,?,?,?)', [parseInt(req.body.userid), order, all, time], function (err) {
            console.log(err);
            return
        })
        res.send()
    })
})

router.post('/back/addMenu', function (req, res) {
    let body = req.body
    sql.Insert('INSERT INTO menu values(null,?,?,?,?)', [body.MenuName, body.introduce, body.price, body.soft], function (err) {
        if (err) {
            console.log('insert is fail' + err);
            return
        }
        res.redirect('/back?userid=' + req.query.userid)
    })
})

router.post('/back/upMenu', function (req, res) {
    let body = req.body
    sql.Update('UPDATE menu SET menuName = ? ,introduce = ? , price = ? , soft = ? WHERE id = ?',
        [body.MenuName, body.introduce, body.price, body.soft, req.query.id], function (err) {
            if (err) {
                console.log('update is faild' + err);
                return
            }
            res.redirect('/back/showMenu?userid=' + req.query.userid)
        })
})

router.post('/back/upload', function (req, res) {
    let form = new Formidable.IncomingForm()
    form.parse(req, function (err, fields, files) {
        let tempPath = files.file.path
        let rs = fs.createReadStream(tempPath)
        let ws = fs.createWriteStream('./public/img/' + files.file.name)
        rs.pipe(ws)
        sql.Update('UPDATE seller SET imgAddr = ? WHERE id = ?', [files.file.name, req.query.userid], function (err) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message)
                return
            }
            res.redirect('/back?userid=' + req.query.userid)
        })
    })
})

router.post('/back/upImg', function (req, res) {
    let form = new Formidable.IncomingForm()
    form.parse(req, function (err, fields, files) {
        let tempPath = files.file.path
        let rs = fs.createReadStream(tempPath)
        let ws = fs.createWriteStream('./public/back/img/' + files.file.name)
        rs.pipe(ws)
        sql.Update('UPDATE menu SET imgUrl = ? WHERE id = ?', [files.file.name, req.query.id], function (err) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message)
                return
            }
            res.redirect('/back/showMenu?userid=' + req.query.userid)
        })
    })
})

router.post('/login', function (req, res) {
    let body = req.body
    if (body.code === req.session.code) {
        let sqlStr = 'SELECT * FROM user '
        sql.Select(sqlStr, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message)
                return
            }
            let ok = false
            for (i of result) {
                if (i.useName === body.useName && i.name === body.name) {
                    ok = false
                    break
                } else {
                    ok = true
                }

            }
            if (ok) {
                let md5 = crypto.createHash('md5')
                let addSql = 'INSERT INTO user VALUES(null,?,?,?,?)'
                let addSqlParams = [body.useName, body.name, md5.update(body.password).digest('hex'), body.email]
                sql.Insert(addSql, addSqlParams, function (err) {
                    if (err) {
                        console.log('[INSERT ERROR] - ', err.message)
                        return
                    }
                    res.render('login.html')
                })
            } else {
                req.flash('error', '该用户已存在')
                res.redirect('/resg')
            }
        })
    } else {
        req.flash('error', '验证码错误')
        res.redirect('/resg')
    }
})

router.post('/index', function (req, res) {
    let body = req.body
    let sqlStr = 'SELECT * FROM user '
    sql.Select(sqlStr, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message)
            return
        }
        let md5 = crypto.createHash('md5')
        let ok = false
        let userid
        for (i of result) {
            if (i.useName === body.useName && i.password === md5.update(body.password).digest('hex')) {
                userid = i.id
                ok = true
                break
            } else {
                ok = false
            }
        }
        if (ok) {
            res.render('index.html', { userid: userid })
        } else {
            req.flash('error', '登录信息有误')
            res.redirect('/login')
        }
    })
})

router.post('/back/main', function (req, res) {
    let body = req.body
    let sqlStr = 'SELECT * FROM seller '
    sql.Select(sqlStr, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message)
            return
        }
        let ok = false
        if (Array.from(result).length === 0) {
            ok = true
        }
        for (i of result) {
            if (i.useName === body.useName && i.name === body.name) {
                ok = false
                break
            } else {
                ok = true
            }

        }
        if (ok) {
            let md5 = crypto.createHash('md5')
            let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
            let addSql = 'INSERT INTO seller(useName,password,addr,num,createTime) VALUES(?,?,?,?,?)'
            let addSqlParams = [body.useName, md5.update(body.password).digest('hex'), body.addr, body.num, time]
            sql.Insert(addSql, addSqlParams, function (err) {
                if (err) {
                    console.log('[INSERT ERROR] - ', err.message)
                    return
                }
                res.render('backLogin.html')
            })
        } else {
            req.flash('error', '该用户已存在')
            res.redirect('/back/resg')
        }
    })
})

router.post('/back', function (req, res) {
    let body = req.body
    let sqlStr = 'SELECT * FROM seller '
    sql.Select(sqlStr, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message)
            return
        }
        let md5 = crypto.createHash('md5')
        let ok = false
        for (i of result) {
            if (i.useName === body.useName && i.password === md5.update(body.password).digest('hex')) {
                ok = true
                break
            } else {
                ok = false
            }
        }
        if (ok) {
            sql.Selects('SELECT id,imgAddr FROM seller WHERE useName = ?', body.useName, function (err, result1) {
                if (err) {
                    console.log(err);
                    return
                }
                sql.Select('SELECT id,`order`,states FROM click limit 8 ', function (err, result2) {
                    if (err) {
                        console.log(err);
                        return

                    }
                    sql.Select('SELECT * FROM feedback limit 8', function (err, result3) {
                        if (err) {
                            console.log(err);
                            return

                        }
                        res.render('back.html', {
                            userid: result1[0].id,
                            orderID: result2[0].id,
                            imgAddr: result[0].imgAddr,
                            useName: body.useName,
                            click: result2,
                            feedback: result3
                        })
                    })
                })

            })
        } else {
            req.flash('error', '登录信息有误')
            res.redirect('/back/main')
        }
    })
})

router.post('/orderMore1', function (req, res) {
    let from = 8 * req.body.count
    sql.Selects('SELECT useName,imgAddr FROM seller WHERE id = ?', parseInt(req.body.userid), function (err, result) {
        if (err) {
            console.log(err);
            return

        }
        sql.Selects('SELECT DISTINCT clickID,states FROM click limit ?,8 ', from, function (err, result2) {
            if (err) {
                console.log(err);
                return

            }
            sql.Select('SELECT * FROM feedback limit 8', function (err, result3) {
                if (err) {
                    console.log(err);
                    return

                }
                res.render('back.html', {
                    userid: req.query.userid,
                    imgAddr: result[0].imgAddr,
                    useName: result[0].useName,
                    click: result2,
                    feedback: result3
                })
            })
        })
    })
})

router.post('/orderMore2', function (req, res) {
    let from = 8 * req.body.count
    sql.Selects('SELECT useName,imgAddr FROM seller WHERE id = ?', parseInt(req.body.userid), function (err, result) {
        if (err) {
            console.log(err);
            return

        }
        sql.Select('SELECT DISTINCT clickID,states FROM click limit 8 ', function (err, result2) {
            if (err) {
                console.log(err);
                return

            }
            sql.Selects('SELECT * FROM feedback limit ?,8', from, function (err, result3) {
                if (err) {
                    console.log(err);
                    return

                }
                res.render('back.html', {
                    userid: req.query.userid,
                    imgAddr: result[0].imgAddr,
                    useName: result[0].useName,
                    click: result2,
                    feedback: result3
                })
            })
        })
    })
})

router.post('/sendEmail', function (req, res) {
    ver.Send(req.body.email, function (code) {
        req.session.code = code
        res.send({ text: '验证码发送成功' })
    })
})

module.exports = router