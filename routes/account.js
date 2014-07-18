var mongoose = require('mongoose')

require('../models/account');
var Account = mongoose.model( 'account' );
var Guestbook = mongoose.model( 'guestbook' );

module.exports = {
	index: function(req, res){
		// Account.find( function ( err, users, count ){
			Guestbook.find( function ( err, message, count ){
		  	res.render('index', { user: req.user,  guestbook : message });
		  });
		// });
	},
	indexP: function(req, res){
		res.redirect('/');
		Guestbook.find({updated_at:-1}, function ( err, guestbook, count ){
		// 	Guestbook.find( function ( err, message, count ){
			// res.render('index', { user: req.user, guestbook : guestbook });
	  	new Guestbook({ 
		    username   : req.body.username,
		    message    : req.body.comment,
		    updated_at : new Date()
		  }).save(function ( err, todo, count ) {
		    if (err) {
		// 	      return res.render('register', { account : account });
	    	}
	    });
		// 	    res.render('index', { 
		// 	    	user: req.user,
		// 	    	message: 'aas',
		// 	    	name: '今天天氣真好',
		// 	    	date: new Date()  
		// 	    });
		// 	  });
		//   });
		});
	},
  loginG: function (req, res){
  	res.render('login', { 
  		user: req.user, 
  		message: req.flash('error') 
  	});
  },
  loginP: function (req, res){
    res.redirect('/');
  },
  registerG: function (req, res){
  	res.render('register', { user: req.user, message: req.flash('error') });
  },
  registerP: function (req, res){
		Account.find( function ( err, users, count ){
	  	new Account({ 
		    username : req.body.username,
		    nid         : users.length+1,
		    username    : req.body.username,
		    password    : req.body.password,
		    email    : req.body.email,
		    updated_at : new Date()
		  }).save(function ( err, todo, count ) {
		    if (err) {
		      return res.render('register', { account : account });
		    }
		    res.redirect('/');
		  });
		});
  },
	account: function (req, res){
		res.render('account', { user: req.user });
  },
  logout: function (req, res){
	  req.logout();
	  res.redirect('/');
  } 
};