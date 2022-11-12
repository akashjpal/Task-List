const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://akash:akash@cluster0.trdd6ez.mongodb.net/todolistDB");

const itemSchema = {
  name:String
}

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
  name:"Welcome to to-do-list!"
})
const item2 = new Item({
  name:"Hit the + button to add more items"
})
const item3 = new Item({
  name:"Hit the delete button to remove items"
})

const defaultItem = [item1,item2,item3];

const listSchema = {
  name:String,
  items : [itemSchema]
}

const List = mongoose.model("List",listSchema)

app.get("/",function(req,res){

  Item.find({},function(err,Items){
    if(Items.length === 0){
      Item.insertMany(defaultItem,function(err){ 
    if(err){
      console.log(err);
    }else{
      console.log("Succesfully Inserted!!");
    }
  });
  res.redirect("/");
  }else{
     res.render('index', {kindOfDay : "Today",newListItems:Items,listType:"To do List"});
}
})
})

app.post("/",function(req,res){
  var inputName = req.body.newItem;
  var listName = req.body.button;

  // console.log(req.body);
  const item = new Item({
  name:inputName
  });
  

  if(listName === "Today"){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name:listName},function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    });
  }
//  res.redirect("/");
})

app.post("/delete",function(req,res){
  // console.log(req.body.checkbox);
  const item_id = req.body.checkbox;
  const ilistName = req.body.DlistName;

  if(ilistName === "Today"){
  Item.findByIdAndRemove(item_id,function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Deleted Successfully!!");
    }
  });
  res.redirect("/");
}
else{
  List.findOneAndUpdate({name:ilistName},{$pull:{items:{_id:item_id}}},function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/"+ilistName);
    }
  });
}
});

// app.get("/work",function(req,res){
//   res.render('index', {kindOfDay : "Work List",newListItems:workItems,listType:"Work List"});
// })

app.get("/about",function(req,res){
  res.render('about',{listType:"About"});
})

app.get("/:customListname", function(req , res){
  // console.log(req.params.customListname);
  // const customListname = req.params.customListname;
  const customListname = _.capitalize(req.params.customListname);

 
  List.findOne({ name: customListname }, function (err,foundList) {
    if(!err){
      if(!foundList){
        // Create a new list
        const list = new List({
        name:customListname,
        items:defaultItem
        });
        list.save();
        res.redirect("/"+customListname);
      }
      else{
        res.render("index",{kindOfDay : foundList.name,newListItems:foundList.items,listType:"Work List"})
      }
    }
  });


});


// app.get("/category/:work",function(req,res){
//   console.log(req.params.work);
//   res.render('index', {kindOfDay : req.params.work,newListItems:defaultItem,listType:"Work List"});
// })
app.listen(process.env.PORT || 2000,function(req,res){
    console.log("Server has Started on port 2000!")
})
