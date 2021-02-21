const router = require('express').Router()
const { error } = require('console');
const User = require('../models/user.model')
// validation
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs')

// register
router.post('/register', async (req, res) => {
  // lets validate before making information a user
  const { name, password, email } = req.body;
  const { error, value } = registerValidation(req.body);

  // console.log(error);
  // res.send(error)

  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  // checking if the user is already in the database
  const emailExist = await User.findOne({ email: email })
  if (emailExist) {
    return res.status(400).send('Email already exists');
  }


  // hash password;
  const salt = await bcrypt.genSalt(12)
  const hashPassword = await bcrypt.hash(password, salt)

  // creating a new user
  const newUser = new User({
    name: name,
    email: email,
    password: hashPassword
  })
  try {
    const savedUser = await newUser.save()
    console.log('The user has been saved');
    // res.send(savedUser)
    res.send({ user: savedUser._id })

  } catch (err) {
    console.error(err)
    return res.status(400).send(err)

  }




})

// login
router.post('/login', async (req, res) => {
  // res.send('login');
  const { email, password } = req.body;
  const { error, value } = loginValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  // checking if the email exists in the database
  const userExist = await User.findOne({ email: email })
  if (!userExist) {
    return res.status(400).send('Invalid Email or Password');
  }

  // check is password is correct
  const validPass = await bcrypt.compare(password, userExist.password)
  if(!validPass) {
    return res.status(400).send('Invalid Email or Password')
  }

  res.send('Logging in!')
  

})

module.exports = router