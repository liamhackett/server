const express = require('express'); 
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const api = require('./controllers/api');
const multer = require("multer");

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });


const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'liamhackett',
    password : '',
    database : 'smart-brain'
  }
});
const app = express();

app.use(cors())
app.use(express.json());

app.get('/', (req, res)=> { res.send(db.users) })

app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/api', upload.single('file'), (req, res) => { api.apiCall(req, res)})

app.listen(3001, ()=> {
  console.log('app is running on port 3001');
})