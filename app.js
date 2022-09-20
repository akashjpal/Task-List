const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var items = ["Awake","Learn","Fun"];
var workItems = []

app.get("/",function(req,res){
  let day = date.getDate();
  res.render('index', {kindOfDay : day,newListItems:items,listType:"To do List"});
})

app.post("/",function(req,res){
  var input = req.body.newItem;
  // console.log(req.body);
  if(req.body.button === "Work"){
    workItems.push(input);
    res.redirect("/work");
  }else{
  items.push(input);
  res.redirect("/");
}
})

app.get("/work",function(req,res){
  res.render('index', {kindOfDay : "Work List",newListItems:workItems,listType:"Work List"});
})

app.get("/about",function(req,res){
  res.render('about',{listType:"About"});
})
app.listen(process.env.port || 3000,function(req,res){
    console.log("Server has Started on port 3000!")
})
