/*
  todo.js -- Router for the ToDoList
*/
const express = require('express');
const router = express.Router();
const TranItem = require('../models/TranItem')
const User = require('../models/User')
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

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

router.get('/tran/edit/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /tran/edit/:itemId")
      const item = 
       await TranItem.findById(req.params.itemId);
      //res.render('edit', { item });
      res.locals.item = item
      res.render('edit')
      //res.json(item)
});

router.post('/tran/updateTranItem',
  isLoggedIn,
  async (req, res, next) => {
      const {itemId,category,description,shu_liang,ri_qi} = req.body;  
      //console.log("inside /todo/complete/:itemId");
      await TranItem.findOneAndUpdate(
        {_id:itemId},
        {$set: {category,description,shu_liang,ri_qi}} );
      res.redirect('/tran')
});

router.get('/tran/byCategory',
  isLoggedIn,
  async (req, res, next) => {
    
    const userId = new mongoose.Types.ObjectId(req.user._id)
    let results = await TranItem.aggregate([
      {
        $match: { userId }
      },
      {
        $group: {
          _id: "$category",
          totalShuLiang: {$sum: "$shu_liang" } //Change "#amount" to something else if you use a different name
        }
      },
      {
        $sort: { totalShuLiang: -1 }
      }
    ]);
        res.render('summarizeByCategory',{results})

});




module.exports = router;
