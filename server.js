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

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
});

const app = express();

const corsOptions = {
  origin: 'https://lhackett-smart-brain-0c98f4a72c64.herokuapp.com', // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // You may need this option if you are using cookies or sessions
};

app.use(cors(corsOptions));
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