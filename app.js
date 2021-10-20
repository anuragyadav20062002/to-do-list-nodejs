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

const listschema = {
  name: String,
  items: [itemschema],
}

const List = mongoose.model("List", listschema)

// //////////////////Main Route///////////////////////

app.get("/", (req, res) => {
  Item.find({}, function (err, founditems) {
    if (founditems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) console.log("Error transferring the items")
        else console.log("successfully inserted items")
      })
      res.redirect("/")
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: founditems,
      })
    }
  })
})

app.post("/", (req, res) => {
  const newItem = req.body.newItem
  const listTitle = req.body.list

  const item = new Item({
    name: newItem,
  })

  if (listTitle === "Today") {
    item.save()
    res.redirect("/")
  } else {
    List.findOne({ name: listTitle }, function (err, foundlist) {
      foundlist.items.push(item)
      foundlist.save()
      res.redirect("/" + listTitle)
    })
  }
})

app.get("/:customListName", (req, res) => {
  const customListName = req.params.customListName

  List.findOne({ name: customListName }, function (err, foundlist) {
    if (!err) {
      if (!foundlist) {
        //creates new list//
        const list = new List({
          name: customListName,
          items: defaultItems,
        })

        list.save()
        res.redirect("/" + customListName)
      } else {
        //dosent create a new list and shows the list created//
        res.render("list", {
          listTitle: foundlist.name,
          newListItems: foundlist.items,
        })
      }
    }
  })
})

app.post("/delete", (req, res) => {
  const itemID = req.body.checkbox
  const listName = req.body.listName

  if (listName === "Today") {
    Item.findByIdAndRemove(itemID, function (err) {
      if (err) {
        console.log("Error in deleting the item")
      } else {
        console.log("Successfully Deleted the desired Item from the Database")
      }
      res.redirect("/")
    })
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: itemID } } },
      function (err) {
        if (!err) {
          res.redirect("/" + listName)
        }
      }
    )
  }
})

app.listen(3000, function () {
  console.log("Server Started successfully on port 3000")
})
