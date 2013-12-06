// We use passport to determine if we're authenticated
module.exports = function(req, res, next) {
 
	'use strict';

	console.log("authenticated policy", req.url)
 
	// Sockets
	if(req.isSocket){
		if(req.session && req.session.passport && req.session.passport.user){
			return next();
		}
		res.json(401);
	}
	// HTTP
	else{
		if(req.isAuthenticated()){
			return next();
		}
             
                
		res.redirect('/login');

	}
 
};