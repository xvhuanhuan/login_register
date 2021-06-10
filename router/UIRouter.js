/*
专门用于管理展示界面的UI路由
 */
//引入Router构造函数
const {Router}=require('express');
//引入cookie-parse
const cookieParser=require('cookie-parser')
const usersModel=require('../model/usersModel')
//创建一个Router实例(路由器就是一个小型的app)
let router=new Router()
//引入path模块-----Node中内置的一个专门用于解决路径问题的库
// let {resolve}=require('path')
router.use(cookieParser());

//用于展示登录界面的路由，无其他任何逻辑 ----- UI路由
router.get('/login',(req,res)=>{
    const {email}=req.query
    //path.resolve(从哪里出发,查找规则),解决路径问题
    // let url=resolve(__dirname,'../public/login.html')
    // res.sendFile(url)
    res.render('login',{errMsg:{email}})
})

//用于展示注册界面的路由，无其他任何逻辑 ----- UI路由
router.get('/register',(req,res)=>{
    //path.resolve(从哪里出发,查找规则),解决路径问题
    // let url=resolve(__dirname,'../public/register.html')
    // res.sendFile(url)
    res.render('register',{errMsg:{}})
})

//用于展示个人中心界面的路由，无其他任何逻辑 ----- UI路由
router.get('/user_center',(req,res)=>{
    //1,获取客户端通过cookie携带过来的session编号
    //2,根据session编号匹配session会话存储
    //3,若匹配上:拿到session会话存储里的数据,去使用
    //4,若未匹配上:驳回,登录
    const {_id}=req.session //req携带过来的是cookie:{key:peiqi,value:经过加密的session编号}
    if(_id){
        //去数据库种查找是否有次id
        //查到了--获取该id对应的昵称
        usersModel.findOne({_id},function (err,data) {
            if(!err&&data){
                //进入此判断意味着,用户不仅携带id,而且id有效
                res.render('userCenter',{nickName:data.nick_name})
            }else{
                //进入此判断意味着:1,与数据库交互的时候产生了错误,2,用户非法篡改了cookie
                res.redirect('http://localhost:3000/login')
            }
        })
    }else{
        //进入此处意味着:1,用户的cookie过期了,2,用户清理了浏览器缓存,3,用户根本没有在此电脑登陆过
        res.redirect('http://localhost:3000/login')
    }


})

//暴露给server,变成函数是为了符合中间件是函数的思想
module.exports=function () {
    return router
}