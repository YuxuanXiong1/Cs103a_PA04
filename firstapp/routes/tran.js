/*
  todo.js -- Router for the ToDoList
*/
const express = require('express');
const router = express.Router();
const TranItem = require('../models/TranItem')


/*
this is a very simple server which maintains a key/value
store using an object where the keys and values are lists of strings

*/

isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

// get the value associated to the key
router.get('/tran/',
  isLoggedIn,
  async (req, res, next) => {
      res.locals.items = await TranItem.find({userId:req.user._id})
      res.render('transactions');
});


/* add the value in the body to the list associated to the key */
router.post('/tran',
  isLoggedIn,
  async (req, res, next) => {
      const tran = new TranItem(
        {item:req.body.item,
         createdAt: new Date(),
         complete: false,
         userId: req.user._id
        })
      await tran.save();
      res.redirect('/tran')
});

router.get('/tran/remove/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /tran/remove/:itemId")
      await TranItem.deleteOne({_id:req.params.itemId});
      res.redirect('/tran')
});



module.exports = router;