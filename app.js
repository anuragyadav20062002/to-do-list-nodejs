const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const app = express()

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  usenewUrlParser: true,
})

const itemschema = {
  name: String,
}

const Item = mongoose.model("Item", itemschema)

const item1 = new Item({
  name: "Hi this is a To Do list",
})

const item2 = new Item({
  name: "Press + to add your new item",
})

const item3 = new Item({
  name: "Check the box to delete the item",
})

const defaultItems = [item1, item2, item3]

Item.insertMany(defaultItems, function (err) {
  if (err) console.log("Error transferring the items")
  else console.log("successfully inserted items")
})

app.get("/", (req, res) => {
  res.render("list", {
    kindOfDay: "Today",
    newListItems: items,
  })
})

app.post("/", (req, res) => {
  var item = req.body.newItem
  items.push(item)
  res.redirect("/")
})

app.listen(3000, function () {
  console.log("Server Started successfully on port 3000")
})
