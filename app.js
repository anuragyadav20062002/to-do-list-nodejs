const express = require("express")
const bodyparser = require("body-parser")

const app = express()
app.set("view engine", "ejs")

app.get("/", (req, res) => {
  res.send("Hello")
})

app.listen(3000, function () {
  console.log("Server Started successfully on port 3000")
})
