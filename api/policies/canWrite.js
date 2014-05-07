// We use passport to determine if we're authenticated
module.exports = function(req, res, next) {
 
	'use strict';

		var project_id = "";
	console.log(req.body)
	
	project_id = req.body.params.project;

	Permission.find({
		user_id : req.session.user.id,
		project_id : project_id
	}).done( function (err, perm){
		if(err) next(err);
		if(perm.length !== 0){
			console.log(perm)
			if (perm[0].right == "rw" || perm[0].right == "admin") next();
			else res.send({err : "You have read-only permission" });
		} 
		else res.send({err : "You are not permitted to perform this action" });
	})

	
 
};