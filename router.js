let express = require('express')
let sd = require('silly-datetime')
let crypto = require('crypto')
let fs = require('fs')
let Formidable = require('formidable')
let router = express.Router()
let sql = require('./db')
let outErr = require('./log')
let ver = require('./verification')
const { LOADIPHLPAPI } = require('dns')
//注册
router.get('/resg', function (_req, res) {
    res.render('resg.html')
})
//登录
router.get('/login', function (_req, res) {
    res.render('login.html')
})
//关于我们
router.get('/about', function (_req, res) {
    res.render('about.html')
})
//后台登录
router.get('/back/main', function (_req, res) {
    res.render('backLogin.html')
})
//后台注册
router.get('/back/resg', function (_req, res) {
    res.render('backResg.html')
})
//后台
router.get('/back', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    sql.Selects('SELECT useName,imgAddr FROM seller WHERE id = ?', req.query.userid, function (err, result) {
        if (err) {
            outErr.LOG('select is fail:' + err)
            return

        }
        sql.Select('SELECT id,`order`,states FROM click limit 8 ', function (err, result2) {
            if (err) {
                outErr.LOG('select is fail:' + err)
                return

            }
            sql.Select('SELECT * FROM feedback limit 8', function (err, result3) {
                if (err) {
                    outErr.LOG('select is fail:' + err)
                    return

                }
                for (i of result3) {
                    var dateee = new Date(i.createTime).toJSON();
                    i.createTime = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
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
//后台菜单
router.get('/back/showMenu', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    sql.Select('SELECT * FROM menu', function (err, result) {
        if (err) {
            outErr.LOG('select is fail:' + err)
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
//菜单牛肉面、粉
router.get('/beef', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    sql.Selects('SELECT * FROM menu WHERE soft = ?', '牛肉面、粉', function (err, result) {
        if (err) {
            outErr.LOG('select is fail:' + err)
            return
        }
        res.render('beef.html', {
            userid: req.query.userid,
            showMenu: result
        })
    })
})
//点单
router.get('/click', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    sql.Select('SELECT * FROM menu', function (err, result) {
        if (err) {
            outErr.LOG('select is fail:' + err)
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
//反馈
router.get('/contact', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    res.render('contact.html', {
        userid: req.query.userid
    })
})
//菜单饮料
router.get('/drink', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    sql.Selects('SELECT * FROM menu WHERE soft = ?', '饮料', function (err, result) {
        if (err) {
            outErr.LOG('select is fail:' + err)
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
//主界面
router.get('/index', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    res.render('index.html', { userid: req.query.userid })
})
//菜单素菜配菜面、粉
router.get('/nood', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    sql.Selects('SELECT * FROM menu WHERE soft = ?', '素菜配菜面、粉', function (err, result) {
        if (err) {
            outErr.LOG('select is fail:' + err)
            return
        }
        res.render('nood.html', {
            userid: req.query.userid,
            showMenu: result
        })
    })
})
//菜单其他
router.get('/other', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    sql.Selects('SELECT * FROM menu WHERE soft = ?', '其他', function (err, result) {
        if (err) {
            outErr.LOG('select is fail:' + err)
            return
        }
        res.render('other.html', {
            userid: req.query.userid,
            showMenu: result
        })
    })
})
//个人中心
router.get('/owen', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    sql.Selects('SELECT c.id,`order`,useName,c.createTime,imgAddr FROM click c INNER JOIN `user` u on u.id = c.userid WHERE u.id = ?', req.query.userid, function (err, result) {
        if (err) {
            outErr.LOG('select is fail:' + err)
            return
        }
        for (i of result) {
            var dateee = new Date(i.createTime).toJSON();
            i.createTime = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        }
        res.render('owen.html', {
            userid: req.query.userid,
            imgAddr: result[0].imgAddr,
            name: result[0].useName,
            grwz: result
        })
    })
})
//后台反馈详情
router.get('/back/showFeed', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    sql.Selects('SELECT * FROM feedback', function (err, result) {
        if (err) {
            outErr.LOG('select is fail:' + err)
            return
        }
        var dateee = new Date(result[0].createTime).toJSON();
        createTime = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        res.render('showFeed.html', {
            userid: req.query.userid,
            feed: result[0].feed,
            createTime: createTime,
            phone: result[0].phone,
            email: result[0].email,
            id: result[0].id

        })
    })

})
//添加新菜
router.get('/back/addMenu', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    res.render('addMenu.html', {
        userid: req.query.userid
    })
})
//修改菜单
router.get('/back/upMenu', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    sql.Selects('SELECT * FROM menu WHERE id = ?', req.query.id, function (err, result) {
        if (err) {
            outErr.LOG('select is fail:' + err)
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
//删除菜
router.get('/back/delMenu', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    sql.Delete(req.query.id, 'menu', function (err) {
        if (err) {
            outErr.LOG('delete is fail:' + err)
            return
        }
        res.redirect('/back/showMenu?userid=' + req.query.userid)
    })
})
//删除订单
router.get('/del', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    sql.Delete(req.query.orderID, 'click', function (err) {
        if (err) {
            outErr.LOG('delete is fail:' + err)
            return
        }
        res.redirect('/owen?userid=' + req.query.userid)
    })
})

router.get('/back/del', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    sql.Delete(req.query.orderID, 'click', function (err) {
        if (err) {
            outErr.LOG('delete is fail:' + err)
            return
        }
        res.redirect('/back?userid=' + req.query.userid)
    })
})
//删除反馈
router.get('/back/delFeed', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    sql.Delete(req.query.ID, 'feedback', function (err) {
        if (err) {
            outErr.LOG('delete is fail:' + err)
            return
        }
        res.redirect('/back?userid=' + req.query.userid)
    })
})
//显示订单详情
router.get('/showOrderMain', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    sql.Selects('SELECT `order`,`all`,createTime FROM click WHERE id = ?', req.query.orderID, function (err, result) {
        if (err) {
            outErr.LOG('select is fail:' + err)
            return
        }
        var dateee = new Date(result[0].createTime).toJSON();
        createTime = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        res.render('showOrderMain.html', {
            userid: req.query.userid,
            id: req.query.orderID,
            order: result[0].order,
            createTime: createTime,
            all: result[0].all
        })
    })
})
//修改菜单图片
router.get('/back/addimgs', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    sql.Selects('SELECT * FROM menu WHERE id = ?', req.query.id, function (err, result) {
        if (err) {
            outErr.LOG('select is fail:' + err)
            return
        }
        res.render('addimgs.html', {
            userid: req.query.userid,
            id: result[0].id,
            imgUrl: result[0].imgUrl,
            soft: result[0].soft,
            menuName: result[0].menuName,
            introduce: result[0].introduce,
            price: result[0].price
        })
    })
})
//后台订单详情
router.get('/back/showOrder', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    sql.Selects('SELECT `order`,`all`,createTime FROM click WHERE id = ?', req.query.orderID, function (err, result) {
        if (err) {
            outErr.LOG('select is fail:' + err)
            return
        }
        var dateee = new Date(result[0].createTime).toJSON();
        createTime = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        res.render('showOrder.html', {
            userid: req.query.userid,
            id: req.query.orderID,
            order: result[0].order,
            createTime: createTime,
            all: result[0].all
        })
    })
})
//购物车
router.get('/cart', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    sql.Selects('SELECT c.id,c.num,m.menuName,m.price,c.menu_id FROM cart c INNER JOIN menu m ON c.menu_id = m.id WHERE user_id = ?', 11, function (err, result) {
        if (err) {
            outErr.LOG('update is fail:' + err)
            return
        }
        res.render('cart.html', {
            cart: result,
            userid: 11
        })
    })
})

router.post('/carts', function (req, res) {
    sql.Selects('SELECT id FROM menu WHERE menuName = ?', req.body.menuName, function (err, result) {
        if (err) {
            outErr.LOG('select is fail:' + err)
            return
        }
        sql.Insert('INSERT INTO cart(user_id,menu_id,num) VALUES(?,?,?) ON DUPLICATE KEY UPDATE  num = num + 1', [req.body.userid, result[0].id, 1], function (err) {
            if (err) {
                outErr.LOG('insert is fail:' + err)
                return
            }
            res.send('添加成功')
        })
    })

})

router.post('/deCart', function (req, res) {
    sql.Update('UPDATE cart SET num = num - 1 WHERE user_id = ? AND menu_id = ? ', [req.body.userid, req.body.id], function (err) {
        if (err) {
            outErr.LOG('update is fail:' + err)
            return
        }
        res.send('减少成功')
    })
})

router.post('/addCart', function (req, res) {
    sql.Update('UPDATE cart SET num = num + 1 WHERE user_id = ? AND menu_id = ? ', [req.body.userid, req.body.id], function (err) {
        if (err) {
            outErr.LOG('update is fail:' + err)
            return
        }
        res.send('增加成功')
    })
})

router.post('/back/finish', function (req, res) {
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
    sql.Update('UPDATE click SET states = 1,upTime = ? WHERE id = ?', [time, req.body.orderID], function (err) {
        if (err) {
            outErr.LOG('update is fail:' + err)
            return
        }
        res.send('订单已完成')
    })
})

router.post('/downClick', function (req, res) {
    sql.Selects('SELECT id,price,menuName FROM menu', function (err, result) {
        if (err) {
            outErr.LOG('select is fail:' + err)
            return
        }
        let all = 0.0
        let order = ""
        for (i of result) {
            for (o of JSON.parse(req.body.data)) {
                if (i.menuName === o.name) {
                    all += parseFloat(i.price) * parseFloat(o.num)
                    order += (i.menuName + "x" + o.num + " ")
                    sql.Deletes('DELETE FROM cart WHERE user_id = ? AND menu_id =? ', [req.body.userid, i.id], function (err) {
                        if (err) {
                            outErr.LOG('delete is fail:' + err)
                            return
                        }
                    })
                }
            }
        }
        let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
        sql.Insert('INSERT INTO click(userid,`order`,`all`,createTime) values(?,?,?,?)', [parseInt(req.body.userid), order, all, time], function (err) {
            if (err) {
                outErr.LOG('insert is fail:' + err)
                return
            }
            res.send('下单成功')
        })
    })
})

router.post('/back/addMenu', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    let body = req.body
    sql.Insert('INSERT INTO menu values(null,?,?,?,?)', [body.MenuName, body.introduce, body.price, body.soft], function (err) {
        if (err) {
            outErr.LOG('insert is fail:' + err)
            return
        }
        res.redirect('/back?userid=' + req.query.userid)
    })
})

router.post('/back/upMenu', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    let body = req.body
    sql.Update('UPDATE menu SET menuName = ? ,introduce = ? , price = ? , soft = ? WHERE id = ?',
        [body.MenuName, body.introduce, body.price, body.soft, req.query.id], function (err) {
            if (err) {
                outErr.LOG('update is fail:' + err)
                return
            }
            res.redirect('/back/showMenu?userid=' + req.query.userid)
        })
})

router.post('/back/upload', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    let form = new Formidable.IncomingForm()
    form.parse(req, function (err, fields, files) {
        let tempPath = files.file.path
        let rs = fs.createReadStream(tempPath)
        let ws = fs.createWriteStream('./public/img/' + files.file.name)
        rs.pipe(ws)
        sql.Update('UPDATE seller SET imgAddr = ? WHERE id = ?', [files.file.name, req.query.userid], function (err) {
            if (err) {
                outErr.LOG('update is fail:' + err)
                return
            }
            res.redirect('/back?userid=' + req.query.userid)
        })
    })
})

router.post('/upload', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    let form = new Formidable.IncomingForm()
    form.parse(req, function (err, fields, files) {
        let tempPath = files.file.path
        let rs = fs.createReadStream(tempPath)
        let ws = fs.createWriteStream('./public/img/' + files.file.name)
        rs.pipe(ws)
        sql.Update('UPDATE user SET imgAddr = ? WHERE id = ?', [files.file.name, req.query.userid], function (err) {
            if (err) {
                outErr.LOG('update is fail:' + err)
                return
            }
            res.redirect('/owen?userid=' + req.query.userid)
        })
    })
})

router.post('/back/upImg', function (req, res) {
    if (isNaN(req.query.userid)) {
        return
    }
    let form = new Formidable.IncomingForm()
    form.parse(req, function (err, fields, files) {
        let tempPath = files.file.path
        let rs = fs.createReadStream(tempPath)
        let ws = fs.createWriteStream('./public/img/' + files.file.name)
        rs.pipe(ws)
        sql.Update('UPDATE menu SET imgUrl = ? WHERE id = ?', [files.file.name, req.query.id], function (err) {
            if (err) {
                outErr.LOG('update is fail:' + err)
                return
            }
            res.redirect('/back/showMenu?userid=' + req.query.userid)
        })
    })
})

router.post('/addContact', function (req, res) {
    let body = req.body
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
    sql.Insert('INSERT INTO feedback values(null,?,?,?,?)', [body.phone, body.email, body.feed, time], function (err) {

        if (err) {
            outErr.LOG('insert is fail:' + err)
            return
        }
        res.render('jump.html', {
            userid: req.query.userid
        })
    })

})

router.post('/login', function (req, res) {
    let body = req.body
    if (body.code === req.session.code) {
        let sqlStr = 'SELECT * FROM user '
        sql.Select(sqlStr, function (err, result) {
            if (err) {
                outErr.LOG('select is fail:' + err)
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
                let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
                let addSql = 'INSERT INTO user(useName,password,email,createTime) VALUES(?,?,?,?)'
                let addSqlParams = [body.useName, md5.update(body.password).digest('hex'), body.email, time]
                sql.Insert(addSql, addSqlParams, function (err) {
                    if (err) {
                        outErr.LOG('insert is fail:' + err)
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
            outErr.LOG('select is fail:' + err)
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
            outErr.LOG('select is fail:' + err)
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
            let addSql = 'INSERT INTO seller(useName,password,createTime) VALUES(?,?,?,?,?)'
            let addSqlParams = [body.useName, md5.update(body.password).digest('hex'), time]
            sql.Insert(addSql, addSqlParams, function (err) {
                if (err) {
                    outErr.LOG('insert is fail:' + err)
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
            outErr.LOG('select is fail:' + err)
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
                    outErr.LOG('select is fail:' + err)
                    return
                }
                sql.Select('SELECT id,`order`,states FROM click limit 8 ', function (err, result2) {
                    if (err) {
                        outErr.LOG('select is fail:' + err)
                        return

                    }
                    sql.Select('SELECT * FROM feedback limit 8', function (err, result3) {
                        if (err) {
                            outErr.LOG('select is fail:' + err)
                            return

                        }
                        for (i of result3) {
                            var dateee = new Date(i.createTime).toJSON();
                            i.createTime = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
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
    let from = 8 * req.body.count + 8
    sql.Selects('SELECT id,`order`,states FROM click limit ? ', from, function (err, result2) {
        if (err) {
            outErr.LOG('select is fail:' + err)
            return

        }
        res.send({ click: result2 })
    })
})

router.post('/orderMore2', function (req, res) {
    let from = 8 * req.body.count + 8
    sql.Selects('SELECT * FROM feedback limit ?', from, function (err, result3) {
        if (err) {
            outErr.LOG('select is fail:' + err)
            return

        }
        for (i of result3) {
            var dateee = new Date(i.createTime).toJSON();
            i.createTime = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        }
        res.send({ feedback: result3 })
    })
})

router.post('/sendEmail', function (req, res) {
    ver.Send(req.body.email, function (code) {
        req.session.code = code
        res.send({ text: '验证码发送成功' })
    })
})

module.exports = router