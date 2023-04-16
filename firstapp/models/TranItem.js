
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var TranItemSchema = Schema( {
  description: String,
  category: String,
  aomunt: Number,
  date: Date,
  userId: ObjectId
} );

module.exports = mongoose.model( 'TranItem', TranItemSchema );
