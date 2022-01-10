var pool=require('./database');
const bcrypt=require('bcrypt');
const { listen } = require('../app');
function User() {};
User.prototype={
    find: function(user=null,callback){
        console.log("user here==>"+JSON.stringify(user));

        if(user){
            var field=Number.isInteger(user)?'id': 'userName';
        }
        console.log("field==>"+field);
        let sql=`select * from user_data where ${field}=? and role="User"`;
        console.log("sql==>"+sql);
        pool.query(sql,user,function(err,result){
            if(err) throw err;
            console.log("result==>"+JSON.stringify(result))
            callback(result);
        });
    },

    findAdmin: function(user=null,callback){
        console.log("user here==>"+JSON.stringify(user));

        if(user){
            var field=Number.isInteger(user)?'id': 'userName';
        }
        let sql=`select * from user_data where ${field}=? and role="Admin"`;
        console.log("sql==>"+sql);
        pool.query(sql,user,function(err,result){
          
            if(err) throw err;
            console.log("result==>"+JSON.stringify(result))
            callback(result);
        
        });
    },
    
    addProduct:function(body,callback){

        let sql=`insert into product_data(productName,description,created,lastUpdated,adminStatus) values(?,?,?,?,?)`;
        pool.query(sql,Object.values(body),function(err,lastId){
            if(err) throw err;
            callback(lastId);
        });
    },
    create:function(body,callback){

        let sql=`insert into user_data(firstname,lastname,userName,password) values(?,?,?,?)`;
        pool.query(sql,Object.values(body),function(err,lastId){
            if(err) throw err;
            callback(lastId);
        });
    },

    login:function(username,password,callback){
       this.find(username,function(user){
           console.log("user===>"+JSON.stringify(user))
           if(user.length>0){
               console.log("inside user login")
            
               if((password===user[0].password)){
                   console.log("Hi")
                   callback(user);
                   return;
               }
               
           }
           else{
               console.log("inside else")
           }
           callback(null);
       }) 
    },

    loginAdmin:function(username,password,callback){
        this.findAdmin(username,function(user){
            if(user.length>0){
                if((password===user[0].password)){
                    callback(user);
                    return;
                }
                
            }
            callback(null);
        }) 
     },

     productDetails:function(id,keyToDisplay,callback){
        let sql
         if(id==0){
             if(keyToDisplay=='displayAll'){
                sql="select * from product_data where adminStatus='Reviewed'";
             }
             else{
             sql=`select * from product_data`;
             }
         }
         else{
             sql="select * from product_data where id='"+id+"'";
         }
        console.log("inside product details")
      
        pool.query(sql,function(err,lastId){
            if(err) throw err;
            callback(lastId);
        });
     },

     productDetailsUser:function(callback){
        console.log("inside product details")
        let sql=`select * from product_data`;
        pool.query(sql,function(err,lastId){
            if(err) throw err;
            callback(lastId);
        });
     },

     
     userDetails:function(id,callback){
        console.log("inside user details")
        let sql;
        if(id==0){
         sql="select * from user_data where (role!='Admin' or role is null)";
        }
        else{
            sql="select * from user_data where id='"+id+"' and (role!='Admin' or role is null)"; 
        }
        console.log("sql==>"+sql)
        pool.query(sql,function(err,lastId){
            if(err) throw err;
            callback(lastId);
        });
     },

     deleteUser:function(id,callback){
        console.log("inside deleteUser ")
      
           let sql="delete  from user_data where id='"+id+"'"; 
        
        pool.query(sql,function(err,lastId){
            if(err) throw err;
            callback(lastId);
        });
     },

     updateInformationUser:function(id,firstname,lastname,username,callback){
        console.log("inside updateInformationUser ")
      
           let sql="update user_data set firstname='"+firstname+"',lastname='"+lastname+"',userName='"+username+"' where id='"+id+"'"; 
        console.log("sql==>"+sql);
        pool.query(sql,function(err,lastId){
            if(err) throw err;
            callback(lastId);
        });
     },

     updateInformationProduct:function(id,productName,description,callback){
        console.log("inside updateInformationProduct ")
      
           let sql="update product_data set productName='"+productName+"',description='"+description+"' where id='"+id+"'"; 
        console.log("sql==>"+sql);
        pool.query(sql,function(err,lastId){
            if(err) throw err;
            callback(lastId);
        });
     },
     
     deleteProduct:function(id,status,callback){
        console.log("inside deleteProduct ")
        let sql
        if(status=='Deleted'){
            sql="delete from product_data where id='"+id+"'"; 
        }
        else{
           sql="update product_data set adminStatus='"+status+"' where id='"+id+"'"; 
        }
        
        pool.query(sql,function(err,lastId){
            if(err) throw err;
            callback(lastId);
        });
     },

  
     
}

module.exports=User;
