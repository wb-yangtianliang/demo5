const Koa = require('koa');
const app = new Koa();

const static = require('koa-static');
const path = require('path');
const router = require('koa-router')();
const bodyparser = require('koa-bodyparser');
const query = require('./db/query');
app.use(static(path.join(process.cwd(), 'public')));

app.use(bodyparser())

app.use(router.routes())
app.use(router.allowedMethods())

//查看-----------------------------------------------------------------------
router.get('/list', async ctx => {
    let data = await query('select * from userlist');
    ctx.body = data
})

//添加------------------------------------------------------------------------
router.post('/add', async ctx => {
        let { username, password, idcard } = ctx.request.body;
        if (username && password && idcard) {
            let user = await query('select * from userlist where idcard=?', [idcard]);
            if (user.length) {
                ctx.body = {
                    code: 0,
                    msg: '此用户已存在'
                }
            } else {
                try {
                    let data = await query('insert into userlist (username,password,idcard) values (?,?,?)', [username, password, idcard])
                    ctx.body = {
                        code: 1,
                        msg: '添加成功'
                    }
                } catch (e) {
                    ctx.body = {
                        code: 0,
                        msg: e
                    }
                }
            }
        } else {
            ctx.body = {
                code: 2,
                msg: '参数缺失'
            }
        }
    })
    //删除---------------------------------------------------------------------
router.get('/dele', async ctx => {
        let { id } = ctx.query;
        if (id || id === 0) {
            try {
                await query('delete from userlist where id=?', [id])
                ctx.body = {
                    code: 1,
                    msg: '删除成功'
                }
            } catch (e) {
                ctx.body = {
                    code: 0,
                    msg: e
                }
            }
        } else {
            ctx.body = {
                code: 2,
                msg: '参数缺失'
            }
        }
    })
    //修改--------------------------------------------------------------------------
router.post('/edit', async ctx => {
        let { username, password, idcard, id } = ctx.request.body;
        if (username && password && idcard) {
            try {
                await query('update userlist set username=?,password=?,idcard=? where id=?', [username, password, idcard, id])
                ctx.body = {
                    code: 1,
                    msg: '修改成功'
                }
            } catch (e) {
                ctx.body = {
                    code: 0,
                    msg: e
                }
            }
        } else {
            ctx.body = {
                code: 2,
                msg: '参数缺失'
            }
        }
    })
    //搜索----------------------------------------------------------------
router.get('/search', async ctx => {
    let { key } = ctx.query;
    let sql = '';
    if (key) {
        sql = `select *from userlist where username like '%${key}%'`
    } else {
        sql = 'select * from userlist'
    }
    try {
        let list = await query(sql);
        ctx.body = {
            code: 1,
            data: list
        }
    } catch (e) {
        ctx.body = {
            code: 0,
            msg: e
        }
    }
})
app.listen(9696, () => {
    console.log('服务器已启动');
})