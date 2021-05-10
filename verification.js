const nodeemailer = require('nodemailer');
const transporter = nodeemailer.createTransport({
    host: "smtp.126.com",
    port: 465,				// 每个邮箱的端口号可能是一样的，一般都使用465，但有些公司使用的就不是465
    secureConnection: true, // 是否使用 SSL
    auth: {
        "user": 'ztxz233@126.com', 		// 你自己的邮箱的邮箱地址
        "pass": 'OEVGRAQBOWVGODRP'         // 授权码
    }
})

let emailCode = (function captchaNumber() {
    let num = [];
    for (let i = 0; i < 6; i++) {
        num[i] = parseInt(Math.random() * 10);
    }
    return num.join('');
})()
//随机生成6位数字


let email = {
    title: '某某的个人网站---邮箱验证码',
    body: `
                <h1>您好：</h1>
                <p style="font-size: 18px;color:#000;">
                    您的验证码为：
                    <span style="font-size: 16px;color:#f00;"> ${emailCode}， </span>
                    您当前正在某某的个人网站注册账号，验证码告知他人将会导致数据信息被盗，请勿泄露
                </p>
                <p style="font-size: 1.5rem;color:#999;">60秒内有效</p>
                `
}

exports.Send = function (toEmail, callback) {
    transporter.sendMail({
        from: 'ztxz233@126.com', // 发件人地址
        to: toEmail, // 收件人地址，多个收件人可以使用逗号分隔
        subject: email.title, // 邮件标题
        html: email.body // 邮件内容
    }, function (error, _info) {
        if (error) {
            return console.log(error);
        }
        console.log('success')
    })
    callback(emailCode)
}
