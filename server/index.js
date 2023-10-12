const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");

app.use(express.json());
app.use(cors())


const db = mysql.createConnection({
      host :'localhost',
      user : 'root',
      password: '',
      database : 'phimniyom shop'
}); 
app.post('/signup', (req, res) => {
    const email = req.body.Email;
    const  Firstname = req.body.Firstname;
    const Lastname  =req.body.Lastname;
    const Tel=  req.body.Tel;
    const address = req.body.address ;
    const city = req.body.city ;
    const country = req.body.country;
    const zipcode =req.body.zipcode;
    
    db.query = ("INSERT INTO user (Email,Firstname,Lastname,Tel,address,city,country,zipcode) VALUES(? , ?, ?,?)",[email,Firstname,Lastname,Tel,address,city,country,zipcode],
    (err,result)=>{
        if(result){
            res.send(result);
        }else{ 
            res.send({message:"enter:"});
    }}
    )
}
)

app.post('/signin', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
   db.query = "SELECT * FROM signin where'email= ? AND 'password'=?", [email,password],
    (err,result)=>{
        if(err){
            req.setEncoding({err:err});
        }else{ 
            if(result.lemgth > 0){
                res.send(result);
            }else
            res.send({message:"enter:"});
    }}
}
    )


 app.listen(8080, () => {
        console.log('Server is running on port 8080');
      });