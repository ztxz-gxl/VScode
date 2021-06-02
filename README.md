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

