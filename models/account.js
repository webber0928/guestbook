var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 
var Account = new Schema({
    nid					: Number,
    username    : String,
    password    : String,
    email    : String,
    updated_at : Date
});
var Guestbook = new Schema({
    username    : String,
    message    : String,
    updated_at : Date
});
 
mongoose.model( 'account', Account );
mongoose.model( 'guestbook', Guestbook );
mongoose.connect( 'mongodb://localhost/guestbook' );
