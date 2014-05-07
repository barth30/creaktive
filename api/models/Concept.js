/**
 * Concept
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

	autoPK : false,


  attributes: {

  	
  	/* e.g.
  	nickname: 'string'
  	*/

    
  	},

  beforeDestroy : function (values, cb){
  	Link.find({
      concept : values.id
    }).done(function(err, links){
      _.each(links, function(l){
        l.destroy(function(err){
          if(err) console.log(err)
        })
      })
    })

  	cb();
  },



};
