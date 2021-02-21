const router = require('express').Router()
const { required } = require('joi')
const verify = require('./verifyToken')
const User = require('../models/user.model')

router.get('/', verify, async (req, res) => {

    const savedUser = await User.findOne({_id: req.user._id})
    if(!savedUser) {
        console.log("User doesn't exists");
    }
    else {
        console.log(savedUser.name + " exists");
    }
    // console.log(req.user._id);
    
    res.status(200).send(req.user)
    // res.json({
    //     posts: {
    //         title: 'My first post',
    //         description: "random data you shouldn't access"
    //     }
    // })
})

module.exports = router