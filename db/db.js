const mysql = require('mysql');

let connecttion = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'root',
    port: '3306',
    database: '1705d'
})
connecttion.connect((error) => {
    if (error) {
        console.log('链接失败');
    } else {
        console.log('链接成功');
    }
})
module.exports = connecttion;