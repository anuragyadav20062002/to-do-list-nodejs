const express = require("express")
const bodyParser = require("body-parser")

const app = express()
var item = ""
app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  var today = new Date()

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  }

  var day = today.toLocaleDateString("en-US", options)

  res.render("list", {
    kindOfDay: day,
    newListItem: item,
  })
})

app.post("/", (req, res) => {
  item = req.body.newItem
  res.redirect("/")
})

app.listen(3000, function () {
  console.log("Server Started successfully on port 3000")
})
