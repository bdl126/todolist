//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");


console.log(date.getDay());
const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const workItems = []
const items=["Buy food", "Cook food", "Eat food"]

app.set('view engine', 'ejs');

app.get("/", function(req, res){
    res.render("list", {listTitle: date.getDay(), newListItems: items})
});

app.post("/", function(req, res){

  const item = req.body.inputText

  if(req.body.list == "Work") {
    workItems.push(item)
    res.redirect("/work")
  } else {
    items.push(item)
    res.redirect("/")
  }

})

app.get("/work", (req,res) => {
  res.render("list", {listTitle: "Work List", newListItems: workItems});
})

app.post("/work", function(req, res){
  const item = req.body.inputText
  workItems.push(item)
  res.redirect("/work")
})

app.get("/about", (req,res) => {
  res.render("about");
})


app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
