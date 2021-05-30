let fs = require('fs');
let sd = require('silly-datetime')
const path = 'd:/table/errer.txt';

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