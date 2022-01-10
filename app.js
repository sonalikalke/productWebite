const express=require('express');
const path=require('path');
const bodyparser = require('body-parser')
const cookieParser = require("cookie-parser");
var session = require('express-session');


const pathRoutes=require('./routes/address');
const app=express();
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use('initial', bodyparser.urlencoded({extended:true}))
app.use('initial', bodyparser.json())

app.use(express.static(path.join(__dirname,'public')));
app.set('views',path.join(__dirname,'views'));

app.set('view engine','ejs');

//sessions
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret:'test_application_sonali',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:oneDay
    }
}));

app.use('/',pathRoutes);

app.use((req,res,next)=>{
    var err=new Error('Page not found');
    err.status=404;
    next(err);
});

app.use((err,req,res,next)=>{
res.status(err.status||500);
res.send(err.message);
})

app.listen(8000,()=>{
    console.log("server running on port number 8000");
})

module.exports=app;
