const express = require("express"); 
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const api = require("./controllers/api");

process.end.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();

app.use(cors())
app.use(express.json());

app.get("/", (req, res)=> { res.send(db.users) })

app.post("/signin", signin.handleSignin(db, bcrypt))
app.post("/register", (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get("/profile/:id", (req, res) => { profile.handleProfileGet(req, res, db)})
app.put("/image", (req, res) => { image.handleImage(req, res, db)})
app.post("/api", upload.single("file"), (req, res) => { api.apiCall(req, res)})

app.listen(process.env.PORT || 3000, ()=> {
  console.log(`app is running on port ${process.env.PORT}`);
})