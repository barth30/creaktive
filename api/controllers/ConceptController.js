/**
 * ConceptmapController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

 module.exports = {


  find : function (req,res){
    
    if(req.body.params.projectId){
    Concept.find({
      project : req.session.currentProject.id
    }).done(function(err,concepts){
      if(err) res.send(err);
      this.concepts = concepts;
      c0 = _.findWhere(concepts, {position : 0});
     
        res.send(concepts)
    });
  }else{
        Concept.find({
    }).done(function(err,concepts){
      if(err) res.send(err);
      this.concepts = concepts;
      c0 = _.findWhere(concepts, {position : 0});
     
        res.send(concepts)
    });
  }

  },

  create : function (req,res){
    var c = req.body.params;
    c.project = req.session.currentProject.id;

    Concept.create(c).done(function(err, concept){
      if(err) res.send(err);
      Notification.objectCreated(req,res,"Concept", c.id, function(notification){
          res.send(notification);
      });
      res.send(concept);
    });
  },

  update : function(req, res){

    Concept.findOne(req.body.params.id).done(function(err, concept){
      if(err) res.send(err);
      if(concept){
        Concept.update({
          id: req.body.params.id
        }, req.body.params).done(function(err,c){
          if(err) res.send(err);
          
          

          Notification.objectUpdated(req,res,"Concept", c[0], function(notification){
            res.send(notification);
          });

          res.send(c[0]);

      });

      }else{
        var concept = req.body.params;
        concept.project = req.session.currentProject.id;
        Concept.create(concept).done(function(err,c){
          if(err) res.send(err);

          Notification.objectCreated(req,res,"Concept", c, function(notification){
            res.send(notification);
          });
          res.send(c);
        });

      }
    })
  },


  destroy : function(req,res){
    Concept.findOne(req.body.params.id).done(function(err,concept){
      if(err) console.log(err);
      concept.destroy(function(err){
        if(err) console.log(err)
          res.send({msg:"destroyed"})
      })
    });
  },

  /*
* Generates the json file for the concepts map
*/
generateTree : function(req,res){
  this.concepts = [];
  this.tree = "";



    /*
    * Format the idea json to mapjs format
    */
    createIdea = function(concept){
      idea = concept;
      idea.text = concept.title
      if (concept.color != "") idea.color = concept.color
        idea.shape = "box";
      idea.children=[];
      return idea;
    }

    /*
    * Add a child to a node
    */
    createChildren = function (father, child){

      father.children.push(child);
    };

    /*
    * Look into concepts and build the json
    * @father : a node
    * @children : all children nodes
    */ 
    populate = function(father, children){
      for (var i = children.length - 1; i >= 0; i--) {

        createChildren(father, children[i])
        
        var c = _.where(this.concepts, {id_father : children[i].id})
        if(c.length > 0){
          this.populate(children[i], c)
        }
      };

    };


    Concept.find({
      project : req.session.currentProject.id
    }).done(function(err,concepts){
      if(err) res.send(err);
      this.concepts = concepts;
      //transform all concept in map idea
      _.each(concepts, function(concept){
        createIdea(concept);
      })

      var json = {root : {}};

      c0 = _.findWhere(concepts, {position : 0});
      c0.text = c0.title;
      c0.layout = "graph-bottom";
      children = _.where(concepts, {id_father : c0.id});
      
      populate(c0, children)
      
      json.root = c0
      json.id ="dhflkjhfsdkljhfdslk"

      res.send({tree : json});
    });
  },
  
  conceptview : function(req,res){
    req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
    // Project.findOne(req.query.projectId).done(function(err, project){
    //   req.session.currentProject = project;
    //   res.view({
    //     currentUser : JSON.stringify(req.session.user),
    //     projectTitle : req.session.currentProject.title,
    //     projectId : req.session.currentProject.id,
    //     currentProject : JSON.stringify(req.session.currentProject)
    //   });
    // })

    Project.findOne(req.query.projectId).done(function(err, project){
      req.session.currentProject = project;
      
      User.find().done(function(err,users){
        Knowledge.find({project:project.id}).done(function(err,knowledges){
          Poche.find({project:project.id}).done(function(err,poches){
            Project.find().done(function(err,projects){
              Concept.find({project:project.id}).done(function(err,concepts){
                Link.find({project:project.id}).done(function(err,links){
                  Notification.find().done(function(err,notifications){
                    Permission.find().done(function(err, permissions){
                      res.view({
                        currentUser : JSON.stringify(req.session.user),
                        projectTitle : req.session.currentProject.title,
                        projectId : req.session.currentProject.id,
                        currentProject : JSON.stringify(req.session.currentProject),
                        users : JSON.stringify(users),
                        knowledges : JSON.stringify(knowledges),
                        poches : JSON.stringify(poches),
                        projects : JSON.stringify(projects),
                        concepts : JSON.stringify(concepts),
                        links : JSON.stringify(links),
                        notifications : JSON.stringify(notifications),
                        permissions : JSON.stringify(permissions)
                      });
                    })
                  })
                })
              })
            })
          })
        })
      })







    })



  }


};
