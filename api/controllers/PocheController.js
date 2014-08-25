/**
 * PocheController
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

  find : function (req,res){
    if(req.body.params.projectId){
      Poche.find({
       project : req.session.currentProject.id
     }).done(function(err,poches){
      if(err) res.send(err)
        res.send(poches)
    });
   }else{
    Poche.find({}).done(function(err,poches){
      if(err) res.send(err)
        res.send(poches)
    });
  }
},

update : function(req, res){
  Poche.findOne(req.body.params.id).done(function(err, poche){
    if(err) res.send(err);
    if(poche){
      Poche.update({id: req.body.params.id}, req.body.params).done(function(err,c){
          if(err) res.send(err);
          req.socket.broadcast.to(req.session.currentProject.id).emit("poche:update", c[0]);
          Notification.objectUpdated(req,res,"Poche", c[0], poche, function(notification){
            res.send(notification);
          });
          res.send(c[0]);   
      });
    }else{
      var p = req.body.params;
      ///////////////////////////
      p.type = "category";
      ///////////////////////////
      p.project = req.session.currentProject.id
      Poche.create(p).done(function(err,c){
        if(err) res.send(err);
        req.socket.broadcast.to(req.session.currentProject.id).emit("poche:create", c);
        Notification.objectCreated(req,res,"Poche", c, function(notification){
          res.send(notification);
        });
        res.send(c);
      });
    }
  });
},

destroy : function(req,res){
  Poche.findOne(req.body.params.id).done(function(err,poche){
    if(err) console.log(err);
    req.socket.broadcast.to(req.session.currentProject.id).emit("poche:remove2", poche);
    Notification.objectRemoved(req,res,"Poche", poche, function(notification){
      res.send(notification);
    });    
    poche.destroy(function(err){
      if(err) console.log(err)
      res.send({msg:"destroyed"})
    });
  });
},


};
