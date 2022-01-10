const express=require('express');
const User=require('../db/user');
var dateTime = require('node-datetime');
const router=express.Router();
const user=new User();
var dt = dateTime.create();
var session;
var formatted = dt.format('Y-m-d H:M:S');

router.get('/login',(req,res,next)=>{
    res.render('login');
});
router.get('/welcomePage',(req,res,next)=>{
    res.render('welcomePage');
});
router.get('/register',(req,res,next)=>{
    res.render('register');
});
router.get('/addProduct',(req,res,next)=>{
    res.render('addProduct');
});
router.get('/adminHomePage',(req,res,next)=>{
    res.render('adminHomePage');
});
router.get('/adminLogin',(req,res,next)=>{
    res.render('adminLogin');
});
router.get('/',(req,res,next)=>{
    // let user=req.session.user;
    // if(user){
    //     res.render('userDashboard');
    //     return;
    // }
    res.render('home');
});
router.get('/userDashboard',(req,res,next)=>{
  var userID=req.query.id;
   res.render('userDashboard',{userID:userID});
  
});

router.get('/getProductList',(req,res,next)=>{
    res.render('adminHomePage');
});

router.get('/viewMyProducts',(req,res,next)=>{
    res.render('viewMyProducts');
});
router.get('/updateUser',(req,res,next)=>{
    var id = req.query.id;
    var key = req.query.key;
    console.log("key===>"+key)
    user.userDetails(id,function(details){
        if(details){
            res.render('updateUser',{details:details,key:key});
        }
    })
   
});

router.get('/productDetails',(req,res,next)=>{
    var id = req.query.id;
    var key = req.query.key;
    var keyToDisplay='';
    console.log("key inside productDetails==>"+key)
    user.productDetails(id,keyToDisplay,function(details){
        if(details){
            res.render('productDetails',{details:details,key:key});
        }
    })
   
});



router.post('/updateUserInfo',(req,res,next)=>{
    var id = req.body.id;
    console.log("updateUserInfo===>"+JSON.stringify(req.body))
    var firstname = req.body.firstname; 
    var lastname = req.body.lastname;
     var username = req.body.userName;
   // var key = req.query.key;
    console.log("id===>"+id)
    user.updateInformationUser(id,firstname,lastname,username,function(details){
        if(details){
            res.render('adminHomePage');
        }
    })
   
});

router.post('/updateProduct',(req,res,next)=>{
    var id = req.body.id;
    console.log("updateUserInfo===>"+JSON.stringify(req.body))
    var productName = req.body.productName; 
    var description = req.body.description;
  
   // var key = req.query.key;
    console.log("id===>"+id)
    user.updateInformationProduct(id,productName,description,function(details){
        if(details){
            res.render('adminHomePage');
        }
    })
   
});


router.get('/getUserList',(req,res,next)=>{
    res.render('adminHomePage');
});

router.post('/login',(req,res,next)=>{
    console.log("inside login")
    session=req.session;
    user.login(req.body.email,req.body.password,function(result){
        if(result){
            session.userid=result[0].id;
            session.name=result[0].firstname;
          if(session.userid){
         //   res.render('userDashboard',{userID:session.userid,name:session.name})
         console.log("here")
            res.render('welcomePage',{userID:session.userid,name:session.name})

          }         
        }
        else{
            res.send('Username/password incorrect')
        }
    });
   // res.json(req.body);

});

router.post('/loginAdmin',(req,res,next)=>{
    console.log("inside loginAdmin")
    console.log("req.body.password===>"+req.body.password)
    user.loginAdmin(req.body.email,req.body.password,function(result){
        if(result){
            console.log("result===>"+JSON.stringify(result))
           // res.render('addProduct')
            res.render('adminHomePage')

        }
        else{
            res.send('Username/password incorrect')
        }
    });
   // res.json(req.body);

   router.post('/updateUser',(req,res,next)=>{
    console.log("inside updateUser")
    // console.log("req.body.password===>"+req.body.password)
    // user.loginAdmin(req.body.email,req.body.password,function(result){
    //     if(result){
    //         console.log("result===>"+JSON.stringify(result))
    //        // res.render('addProduct')
    //         res.render('adminHomePage')

    //     }
    //     else{
    //         res.send('Username/password incorrect')
    //     }
    });
   

});


router.post('/register',(req,res,next)=>{
    console.log("inside register");
    let userInput={
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        username:req.body.email,
        password:req.body.password,
        role:'User'
    };
    console.log("userInput===>"+JSON.stringify(userInput))
    user.create(userInput,function(lastId){
        if(lastId){
           // res.send('Welcome'+userInput.username);
           user.find(lastId,function(result){
               req.session.user=result;
               req.session.opp=0;
           });
           res.redirect('/login')
        }
        else{
            console.log("error in creating user")
        }
    });
   // res.json(req.body);
});

router.post('/addProduct',(req,res,next)=>{
    console.log("inside addProduct");
    let productDetails={
        productName:req.body.pname,
        description:req.body.description,
        created:formatted,
        lastUpdated:formatted,
        adminStatus:'PendingReview'
    };
    console.log("productDetails===>"+JSON.stringify(productDetails))
    user.addProduct(productDetails,function(lastId){
        if(lastId){
            res.render('userDashboard');
        }
        else{
            console.log("error in addeing product")
        }
    });
   // res.json(req.body);
});

router.post('/getProductList',(req,res,next)=>{
    console.log("insode post getProductList")
    let id=0;
    var keyToDisplay='';
    user.productDetails(id,keyToDisplay,function(productD){
        if(productD){
            console.log("productD====>"+JSON.stringify(productD))
            res.render('viewProducts',{
                productD:productD});
        }
        else{
            console.log("error in addeing product")
        }
    });
});
//to display all produacts on website
router.post('/getAllProducts',(req,res,next)=>{
    console.log("insode post getProductList")
    let id=0;
    var keyToDisplay="displayAll"
    user.productDetails(id,keyToDisplay,function(productD){
        if(productD){
            console.log("productD====>"+JSON.stringify(productD))
            res.render('viewMyProducts',{
                productD:productD});
        }
        else{
            console.log("error in addeing product")
        }
    });
});



router.post('/getUserList',(req,res,next)=>{
    console.log("insode post getUserList");
    var id=0;
    user.userDetails(id,function(userD){
        if(userD){
            console.log("userD====>"+JSON.stringify(userD))
            res.render('viewUser',{
                userD:userD});
        }
        else{
            console.log("error in addeing product")
        }
    });
});

//to get the list on admin on user side
router.post('/getUserProductList',(req,res,next)=>{
    console.log("insode post getUserProductList")
    user.productDetailsUser(function(productD){
        if(productD){
            console.log("productD====>"+JSON.stringify(productD))
            res.render('viewProducts',{
                productD:productD});
        }
        else{
            console.log("error in addeing product")
        }
    });
});

//to get the list on products on user side
router.post('/viewMyProducts',(req,res,next)=>{
    console.log("insode post viewMyProducts")
    user.productDetailsUser(function(productD){
        if(productD){
            console.log("productD====>"+JSON.stringify(productD))
            res.render('viewMyProducts',{
                productD:productD});
        }
        else{
            console.log("error in addeing product")
        }
    });
});

router.post('/deleteUser',(req,res,next)=>{
    var id=req.body.id;
    console.log("inside update==>"+id);
        user.deleteUser(id,function(details){
        if(details){
            res.render('adminHomePage');
        }
    })
});

router.post('/deleteProduct',(req,res,next)=>{
    var id=req.body.id;
    var status='Deleted';
    console.log("inside deleteProduct==>"+id);
        user.deleteProduct(id,status,function(details){
        if(details){
            res.render('adminHomePage');
        }
    })
});

router.post('/reviewProduct',(req,res,next)=>{
    var id=req.body.id;
    var status='Reviewed';
    console.log("inside deleteProduct==>"+id);
        user.deleteProduct(id,status,function(details){
        if(details){
            res.render('adminHomePage');
        }
    })
});


module.exports=router;