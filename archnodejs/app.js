const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Post = require("./models/Post");
const fs = require("fs");
const bodyParser = require("body-parser");
var cors = require("cors");
const checkInternetConnected = require("check-internet-connected");

require("dotenv").config({ path: __dirname + "/.env" });

const config = {
  timeout: 5000, //timeout connecting to each server, each try
  retries: 5, //number of retries to do before failing
  domain: "https://www.google.com", //the domain to check DNS record of
};

setInterval(() => {
  checkInternetConnected(config)
    .then(() => {
      fs.readFile("myjson.json", "utf8", async (err, data) => {
        let datas = `{
          "requests":[
              
          ]
      }`;
        jsons = JSON.parse(data);
        if (err) throw err;
        if (jsons.requests.length > 0) {
          fs.writeFile("myjson.json", datas, "utf-8", (err) => {
            console.log("write");
            if (err) throw err;
          });
          // for (let i = 0; i < jsons.requests.length; i++) {
          //   console.log(jsons.requests[i].title);
          // }

          // const post = new Post({
          //   title: jsons.requests[i].title,
          //   description: jsons.requests[i].description,
          // });
          await Post.insertMany(jsons.requests, (err, result) => {
            console.log(result);
          });
        }
      }); //successfully connected to a server
    })
    .catch((ex) => {
      console.log("Offline"); // cannot connect to a server or error occurred.
    });
}, 10000);

app.use(bodyParser.json());
app.use(cors());

//Import routes
const postsRoute = require("./routes/posts");

app.use("/posts", postsRoute);

// ROUTES
// app.use("/posts", () => {
//   console.log("This is a middleware running");
// });

app.get("/", (req, res) => {
  res.send("We are on home");
});
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to DB");
  }
);

app.listen(3000);
