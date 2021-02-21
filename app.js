const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const dotenv = require('dotenv')
// express app
const app = express()
// import routes
const authRoutes = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config()


// body parser
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


// database connection
mongoose.connect( process.env.DB_CONNECT, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('------------------Database is connected!--------------');
});



// route middlewares
app.use('/api/user', authRoutes);
app.use('/api/posts', postRoute)

// port setting 
const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server is up and running');
})