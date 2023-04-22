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
    if (req.query.sort) {
      const sortKey = req.query.sort;
      if (req.query.sort == 'description'){
        res.locals.items = await TranItem.find({userId:req.user._id}).sort({description:1});
      } else if (req.query.sort == 'category'){
        res.locals.items = await TranItem.find({userId:req.user._id}).sort({category:1});
      } else if (req.query.sort == 'amount'){
        res.locals.items = await TranItem.find({userId:req.user._id}).sort({shu_liang:1});
      } else if (req.query.sort == 'date'){
        res.locals.items = await TranItem.find({userId:req.user._id}).sort({ri_qi:1});
      }
    } else {
      res.locals.items = await TranItem.find({userId:req.user._id})
    }
    res.render('transactions');
});


/* add the value in the body to the list associated to the key */
router.post('/tran',  
  isLoggedIn,
  async (req, res, next) => {
      const tran = new TranItem(
        {description: req.body.description,
          category: req.body.category,
          shu_liang: req.body.shu_liang,
          ri_qi: req.body.ri_qi,
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
