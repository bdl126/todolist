//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash")


const app = express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin-bruno:asshole9@cluster0.o3vpt.mongodb.net/todolistDb")

const itemsSchema = {
  name: String
}

const Item = mongoose.model("Item", itemsSchema)
const workItems = []

const item1 = new Item({
  name:"Buy Food"
})

const item2 = new Item({
  name:"Cook Food"
})
const item3 = new Item({
  name:"Eat Food"
})

const defaultItems = [item1, item2, item3]

const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = mongoose.model("List", listSchema)


app.get("/", function(req, res){

  Item.find({}, function(err, items) {
      if(items.length === 0) {
        Item.insertMany(defaultItems, function(err) {
          if (err){
            console.log("error adding defaults ");
          } else {
            console.log("Success adding defaults ");
          }
        })
        res.redirect("/")
      } else {
        res.render("list", {listTitle: "Today", newListItems: items})
      }

    }
  )
});

app.post("/", function(req, res){

    const itemName = req.body.inputText
    const listName = req.body.inputlist
    console.log(req.body);
    // ajouter a la liste courante
    // rediriger vers

    const new_item = new Item({
      name: req.body.inputText
    })

    if(listName === "Today") {
      new_item.save();
      res.redirect("/")
    } else {
      List.findOne({name : listName}, function(err, foundList) {
        console.log(foundList);
        foundList.items.push(new_item)
        foundList.save();
        res.redirect("/" + listName)
      })
    }


})

app.get("/:customListName", (req,res) => {
  const customListName = _.capitalize(req.params.customListName)

  List.findOne({name: customListName}, function (err, foundList) {
    if (!err) {
      if(foundList === null) {
        const list = new List({
          name : customListName,
          items: defaultItems
        })

        list.save();
        res.redirect("/" + customListName)
      } else {
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
      }
    }
  })

})

app.post("/work", function(req, res){
  const item = req.body.inputText
  workItems.push(item)
  res.redirect("/work")
})

app.get("/about", (req,res) => {
  res.render("about");
})

app.post("/delete", function(req, res){
  const checkitemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName == "Today")  {
    Item.findByIdAndRemove(checkitemId, function(err) {
      if (err){
        console.log("error adding defaults ");
      } else {
        console.log("Success deleting ");
        res.redirect("/")
      }
    })
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items:{_id: checkitemId}} }, function(err, foundList) {
      if(!err) {
        res.redirect("/"+listName)
      }
    })
  }

})


app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
