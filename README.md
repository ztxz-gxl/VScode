# food项目介绍

****

**启用**

1. 进入app.js文件，使用VScode的调试功能，选择node.js
2. 在控制台或者cmd中输入`node app.js`

**功能**

1. 前台登录注册功能

   1. 注册功能中包含了，错误返回，密码重复验证，邮箱验证码，且密码采取了md5加密

      ````js
      //验证两次密码是否一致
      let check = () => {
      if(document.getElementById("password").value!==document.getElementById("passwords").value) {
      			alert("两次输入的密码不一致")
      				return false;
      			} else {
      				return true;
      			}
      		}
      
      //ajax进行无动态刷新，并使用后台验证码发送功能
      $('#sendEmail').on('click', () => {
      $.post('/sendEmail', { email: $('#email')[0].value }, function (response) {
      				$('#text')[0].innerHTML = response.text
      			})
      		})
      
      //后台调用已封装的方法发送邮箱验证码，并将验证码放入session中设置60秒保存时间
      router.post('/sendEmail', function (req, res) {
          ver.Send(req.body.email, function (code) {
              req.session.code = code
              res.send({ text: '验证码发送成功' })
          })
      })
      
      //req.flash()返回错误信息
      req.flash('error', '该用户已存在')
      res.redirect('/back/resg')
      
      //密码MD5加密
      let md5 = crypto.createHash('md5')
      md5.update(body.password).digest('hex')
      ````

   2. 登录中将用户输入的密码再次加密，与数据库中密码对比

      ```js
      //验证用户名与密码
      let md5 = crypto.createHash('md5')
      let ok = false
      for (i of result) {
         if (i.useName === body.useName && i.password === 
             md5.update(body.password).digest('hex')) {
                    ok = true
                      break
                  } else {
                    ok = false
                  }
              }
      ```

      

2. 前台，后台数据动态展示

   1. 通过对于数据库的增删改查实现对于数据的展示修改以及删除
   
      ```js
      let mysql = require('mysql')
      //链接数据库创建链接
      let connection = mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: '123456',
          port: '3306',
          database: 'food'
      })
      connection.connect()
      //插入新数据
      exports.Insert = function (sqlStr, addsql, callback) {
          connection.query(sqlStr, addsql, function (err, _result) {
              if (err) {
                  return callback(err)
              }
              callback(null)
          })
      }
      //通过表名以及id删除数据
      exports.Delete = function (id, tab_nanme, callback) {
          connection.query("DELETE FROM " + tab_nanme + " WHERE id = ?", parseInt(id), function (err, _result) {
              if (err) {
                  return callback(err)
              }
              callback(null)
          })
      }
      //多条件删除数据
      exports.Deletes = function (sqlStr, delsql,callback) {
          connection.query(sqlStr, delsql, function (err, _result) {
              if (err) {
                  return callback(err)
              }
              callback(null)
          })
      }
      //更新表中数据
      exports.Update = function (sqlStr, upSql, callback) {
          connection.query(sqlStr, upSql, function (err, _result) {
              if (err) {
                  return callback(err)
              }
              callback(null)
          })
      }
      //无条件查询
      exports.Select = function(sqlStr,callback){
          connection.query(sqlStr, function (err, result) {
              if (err) {
                  return callback(err,null)
              }
              callback(null, result)
          })
      }
      //条件查询
      exports.Selects = function (sqlStr, SelectSql, callback) {
          connection.query(sqlStr, SelectSql, function (err, result) {
              if (err) {
                  return callback(err,null)
              }
              callback(null, result)
          })
      }
      ```
   
   2. 点击查看更多功能
   
      ```js
      //获取点击事件
      $('#orderMore1').on('click',function(){
                      let count = 1
                  $.post('/orderMore1',{userid:'{{userid}}',count:count},function(response){
                      let all = ""
                      let tit = `<tr>
                                  <td >订单号</td>
                                  <td>订单</td>
                                  <td>处理情况(0为未处理,1为已处理)</td>
                                  <td>操作</td>
                              </tr>`
                      for (o of response.click){
                          let tb = `<tr>
                                  <td >${o.id}</td>
                                  <td >${o.order}</td>
                                  <td>${o.states}</td>
                                  <td >
                                      <input type="button" value="详情" id="btn0" onclick="location.href='/back/showOrder?orderID=${o.id}&userid={{userid}}'">
                                      <input type="button" value="删除" id="btn2" onclick="location.href='/back/del?orderID=${o.id}&userid={{userid}}'">
                                  </td>
                              </tr>`
                              all += tb
                      }
                      $('#tb')[0].innerHTML = tit + all
                  })
              })
      
      //返回查询数据
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
      ```
   
3. 添加购物车，下单功能

   1. 添加购物车

      ```js
      //使用ajax获取商品名，将其添加到数据库中的购物车表
      $('.tianj').on('click',function(){
                  let name = $(this).parent().parent().children()[0].innerText
                  $.post('/carts',{userid:'{{userid}}',menuName:name},function(res){
                      alert(res)
                  })
                  
              })
      
      router.post('/carts', function (req, res) {
          sql.Selects('SELECT id FROM menu WHERE menuName = ?', req.body.menuName, function (err, result) {
              if (err) {
                  outErr.LOG('select is fail:' + err)
                  return
              }
              //将数据插入数据库，设置了用户和商品组合唯一键，判断若该商品存在则num+1，不存在则新增
              sql.Insert('INSERT INTO cart(user_id,menu_id,num) VALUES(?,?,?) ON DUPLICATE KEY UPDATE  num = num + 1', [req.body.userid, result[0].id, 1], function (err) {
                  if (err) {
                      outErr.LOG('insert is fail:' + err)
                      return
                  }
                  res.send('添加成功')
              })
          })
      
      })
      ```

   2. 下单功能
   
      ```js
      //购物车页面，通过ajax的方法获取到用户选择的商品名以及价格和数量，通过json传到后台，显示下单成功后跳转页面
      $('#down').on('click',function(){
        $.post('/downClick',{userid:'{{userid}}',data:JSON.stringify(a)},function(res){
            alert(res)
            location.href='/index?userid={{userid}}'
          })
      })
      
      //获取到前台传来的数据拼接订单，以及计算总价，最后存入订单列表中，再返回下单成功字样
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
      ```
   
4. 修改菜单图片，以及修改自己头像

   ```js
   //通过input中的file文件按钮选择图片文件，并修改传输数据的类型，enctype="multipart/form-data"
   <form action="/back/upImg?id={{id}}&userid={{userid}}" method="POST" 
   enctype="multipart/form-data" style="margin-bottom: 20px;">
       
   <a href="javascript:void(0)" class="file">选择图片
   <input id="add1" type="file" value="请选择图片" name="file">
   </a>
   
   <input style="color:white;font-size: 1.4em;width: 95px;padding-top: 0;
   height: 47px;background: #204d74;border-style: hidden;"type="submit" value="上传图片">
   
   </form>
   
   //使用formidable模块，获取文件并将文件存入指定位置，再将文件名修改到对应的数据中
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
   ```

5. 错误封装

   ```js
   //错误写入路径
   const path = 'd:/table/errer.txt';
   
   //导出方法，判断是否存在该文件，若存在则追加错误，若不存在则新建文件并写入错误
   exports.LOG = function (err) {
       fs.exists(path, (exist) => {
           if (exist) {
               console.log('已经存在');
               let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
               fs.appendFile(path, err + time + '\n', (error) => {
                   if (error) {
                       return console.log("追加文件失败" + error.message)
                   }
                   console.log("追加成功");
               })
           } else {
               let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
               fs.writeFile(path, err + time + '\n', (error) => {
                   if (error) {
                       console.log('写入失败');
                       return;
                   } else {
                       console.log('成功');
                   }
   
               })
           }
       })
   }
   ```

   

**模块使用**

`let sd = require('silly-datetime')`上传时间格式化模块

`let crypto = require('crypto')`密码加密模块

`let fs = require('fs')`文件操作模块

`let Formidable = require('formidable')`文件上传模块

`let flash = require('connect-flash');`req.flash使用模块

`let session = require('express-session');`session使用模块

`const nodeemailer = require('nodemailer');`发送邮箱验证码模块

`let mysql = require('mysql')`mysql数据库模块

