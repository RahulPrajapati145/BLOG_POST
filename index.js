const express  = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mysql = require("mysql2");


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

app.get("/posts", (req, res) => {
    db.query("SELECT * FROM posts", (err, results) => {
        if (err) throw err;
        res.render("index.ejs", { posts: results });
    });
});



app.get("/posts/new" ,(req,res)=>{
    res.render("new.ejs");
})

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

app.post("/posts", (req, res) => {
    const { username, content } = req.body;
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


app.get("/posts/edit/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM posts WHERE id = ?", [id], (err, results) => {
        if (err) throw err;
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

app.patch("/posts/:id", (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const q = "UPDATE posts SET content = ? WHERE id = ?";
    db.query(q, [content, id], (err, result) => {
        if (err) throw err;
        res.redirect("/posts");
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

app.delete("/posts/:id", (req, res) => {
    const { id } = req.params;
    const q = "DELETE FROM posts WHERE id = ?";
    db.query(q, [id], (err, result) => {
        if (err) throw err;
        res.redirect("/posts");
    });
});

app.listen(port,()=>{
    console.log("listening on port 3000");
});

