/**
 * ConceptController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */

  create : function(req, res){
  	Concept.create(req.body).done(function (err, concept){
  		if(err) console.log(err)
  		concept.notificate(concept, req);
  		res.send(concept);
  	})
  },
  
  update : function(req,res){
		Concept.findOne(req.body.id).done(function(err,concept){
			if (concept){
					Concept.update({
						id : req.body.id
					},req.body).done(function(err,c){
						if(err) res.send({err:err});
						res.send(c);
					})
			}
			else{
				Concept.create(req.body).done(function(err, c){
					res.send(c)
				})
			}
		})
	},

};
