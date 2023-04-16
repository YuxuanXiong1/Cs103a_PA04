
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var TranItemSchema = Schema( {
  item: String,
  completed: Boolean,
  createdAt: Date,
  userId: ObjectId
} );

module.exports = mongoose.model( 'TranItem', TranItemSchema );
