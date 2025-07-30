const express  = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("connect-flash");
const engine = require("ejs-mate");
app.engine("ejs",engine);
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Aditi@123",        // Use your MySQL password
    database: "postDB"
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL!");
});



app.use(express.urlencoded({extended:true}));
app.set("view engine" , "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const { v4: uuidv4 } = require('uuid');


app.use(session({
    secret:"abcd",
    resave:false,
    saveUninitialized:false
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.username= req.session.username || null;
    next();
});


function requirelogin(req,res,next){
    if(!req.session.userid){
        // console.log("hehe");
        return res.redirect("/login");
    }
    next();
}
// app.use(requirelogin);

// let posts = [
//     {
//          id:uuidv4(),
//          username : "aditi",
//          content :"i love coding"
//     },
//     { 
//         id:uuidv4(),
//           username : "Riya",
//          content :"do hardwork"
//     },
//     { 
//           id:uuidv4(),
//            username : "sunil",
//          content :"heheehe"
//     }
// ]
// app.get("/posts",(req,res)=>{
//     res.render("index.ejs",{posts});
// }) 

app.get("/signup",(req,res)=>{
    res.render("signup.ejs");
});
app.post("/signup",async (req,res)=>{
    console.log(req.body);
    const {username , password} = req.body;
  
    try{
    const hashpassword = await bcrypt.hash(password,10);
    const sql = 'insert into users(username,password) values (?,?)';
    db.query(sql,[username,hashpassword],(err,result)=>{
        // if(err){
        //     console.log(err);
        //     return res.send('error during signup');
        // }
        // // console.log(result);
        // res.send('user registered successfully! <a href="/login">Login Here</a>');

        if (err) {
          console.log(err);
           req.flash('error', 'Error during signup');
           return res.redirect("/signup");
         }
        req.flash('success', 'User registered successfully! Please login.');
        res.redirect("/login");
    });
}catch(err){
    console.log(err);
    res.send("something went wrong");
}

   

});

app.get("/login",(req,res)=>{
    res.render("login.ejs");
});

app.post("/login",(req,res)=>{
    const {username , password} = req.body;

    const sql = 'select * from users where username = ?';
    db.query(sql,[username],async(err,result)=>{
        if(err){
            console.log(err);
            req.flash("error","error during login");
            return res.redirect("/login");
        }
        if(result.length==0){
            req.flash("error","User not found");
            return res.redirect("/login");
        }

        const user = result[0];
        const ismatch = await bcrypt.compare(password,user.password);
        if(!ismatch){
            req.flash("error","Incorrect Password");
            return res.redirect("/login");

        }
        // console.log(req);
        req.session.userid = user.id;
        req.session.username = username;
        // console.log(req);
        req.flash("success","Login Successful!");
        res.redirect("/posts");
    });
});


app.get("/posts", (req, res) => {
    db.query("SELECT * FROM posts", (err, results) => {
        if (err) throw err;
        res.render("index.ejs", { posts: results });
    });
});



app.get("/posts/new" ,requirelogin,(req,res)=>{
    const obj ={
        user : req.session.username
    }
    res.render("new.ejs" , obj);
});

// app.post("/posts",(req,res)=>{
    
//     let obj = {
//         id : uuidv4(),
//         username: req.body.username,
//         content : req.body.content
//     }
//     console.log(obj);
//     posts.push(obj);
    
//     res.redirect("/posts");
// });

app.post("/posts",requirelogin, (req, res) => {
    const username = req.session.username;
    const { content } = req.body;
    const id = uuidv4();
    const q = "INSERT INTO posts (id, username, content) VALUES (?, ?, ?)";
    db.query(q, [id, username, content], (err, result) => {
        if (err) throw err;
        res.redirect("/posts");
    });
});
// app.get("/posts/view/:id",(req,res)=>{
//     let {id} = req.params;
//     // res.send(id);
//     let obj;
//     for(let post of posts){
//         if(post.id == id){
//           obj = post;
//           break;
//         }
//     }
//     console.log(obj);
//     res.render("view.ejs",{obj});
// });

app.get("/posts/view/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM posts WHERE id = ?", [id], (err, results) => {
        if (err) throw err;
        res.render("view.ejs", { obj: results[0] });
    });
});

// app.get("/posts/edit/:id",(req,res)=>{
//    let {id} = req.params;
//    let obj;
//     for(let post of posts){
//         if(post.id == id){
//           obj = post;
//           break;
//         }
//     }
//     // console.log(obj);
//     res.render("edit.ejs",{obj});
// });


app.get("/posts/edit/:id",requirelogin, (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM posts WHERE id = ?", [id], (err, results) => {
        if (err) throw err;
        const post = results[0];
        if(post.username != req.session.username){
            req.flash("error","unauthorized. You can only edit your own posts!!");
            return res.redirect("/posts");
        }
        res.render("edit.ejs", { obj: results[0] });
    });
});

// app.patch("/posts/:id",(req,res)=>{
//     let {id} = req.params;
//     // console.log(req.body);
    
//     // console.log(id);
    
//     for(let post of posts){
//         if(post.id == id){
//           post.content = req.body.content;
//         }
//     }


//     res.redirect("/posts");
// });

app.patch("/posts/:id", requirelogin,(req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    
    const sel_q = "SELECT * from posts where id = ?";
    db.query(sel_q,[id],(err,result)=>{
        if(err){
            throw err;
        }
        const post = result[0];
        
        if(post.username != req.session.username){
            req.flash("error","Unathuraized. only the owner of the post can edit. ")
            return res.redirect("/posts");
        }
        const up_q = "UPDATE posts SET content = ? WHERE id = ?";
        db.query(up_q, [content, id], (err, result) => {
            if (err) throw err;
            res.redirect("/posts");
        });
    });
    
});


// app.delete("/posts/:id", (req,res)=>{
    
//   let {id} = req.params;
//    let temp = [];
//    for(let post  of posts){
//     if(post.id != id){
//         temp.push(post);
//     }
//    }
//    posts = temp;
//    res.redirect("/posts");
// });

app.delete("/posts/:id",requirelogin, (req, res) => {
    const { id } = req.params;

    const sel_q = "SELECT * from posts where id = ?";
    db.query(sel_q,[id],(err,result)=>{
        if(err){
            throw err;
        }
        const post = result[0];
        if(post.username != req.session.username){
           req.flash("error","Unathuraized. only the owner of the post can delete. ")
           return res.redirect("/posts");
        }
        const del_q = "DELETE FROM posts WHERE id = ?";
        db.query(del_q, [id], (err, result) => {
            if (err) throw err;
            res.redirect("/posts");
        });
    });

});

app.get("/logout",requirelogin,(req,res)=>{
    req.flash("success","logged out successfully!");
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
            req.flash("error","error while logging out!");
            return res.redirect("/posts");
        }
    res.redirect("/login");

   });
});

app.listen(port,()=>{
    console.log("listening on port 3000");
});

