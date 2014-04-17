/**
 * UserController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

 var bcrypt = require('bcrypt');

 function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
 function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();}
 function getDate(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();}


 module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */


  find : function (req,res){
    User.find().done(function(err,users){
      if(err) res.send({err:err})
      res.send(users)
    });

  },

  
  update : function(req,res){
  	User.findOne(req.body.params.id).done(function(err, user){
  		if(err) res.send({err:err});
  		if(user){
  			User.update({id: req.body.params.id}, req.body.params).done(function(err,c){
  				if(err) res.send({err:err})
            res.send(c);
        });
  		}else{
  			User.create(req.body.params).done(function(err,p){
  				if(err) res.send({err:err})
            p.confirmed = true;
          p.save(function(err, u){
            if(err) res.send({err:err})
            res.send(u);
          })
          
        })
  		}
  	})
  },

  destroy : function(req,res){
    User.findOne(req.body.params.id).done(function(err,user){
      if(err) console.log(err);
      user.destroy(function(err){
        if(err) console.log(err)
          res.send({msg:"destroyed"})
      })
    });
  },

  inviteUser : function(req,res){
    console.log(req.body)
    User.create({
      img : "/img/default-user-icon-profile.png",
      name : req.body.email.substring(0,req.body.email.indexOf("@")),
      email : req.body.email,
      pw : "JKHk!lm3682jhqmfljzdofij654654dfsdf6522dfs#mkldqj$",
      confirmed : false,
      id : guid()
    }).done(function(err, user){
      if(err) res.send({err:err})


        var url = "";
      if(req.baseUrl == "http://localhost:1337"){
        url = req.baseUrl + "/register?id=" + user.id;
      } 
      else{
        var u = req.baseUrl
        u = u.slice(0, u.lastIndexOf(":"))
        url = u + "/register?id=" + user.id;
      }

      
      sails.config.email.sendRegistrationMail(user.email, url,function(err, msg){
        if(err) console.log(err)
          console.log(msg)
      });


      Permission.create({
        id: guid(),
        right : "r",
        user_id : user.id,
        project_id : req.session.currentProject.id
      }).done(function(err, permission){
        if(err) res.send({err:err})
          res.send({user : user, permission : permission})
      })
    })


  },

  changepassword : function(req,res){
    user = req.session.user;

    bcrypt.compare(req.body.oldpassword, user.pw, function (err, res) {
      if (!res) res.send("Invalid password")
        if(req.body.password == req.body.confirmPassword){
          user.pw = req.body.password
          user.hashPassword(user, function(err, user){
            user.save(function(err, user){
              req.session.user = user;
              res.redirect("/editprofile") 
            })
          })

          
        }else{
          res.send("Password must match")
        }
      });

  },

  editprofile : function(req,res){
    User.findOne(req.session.user.id).done(function(err, user){
      user.email = req.body.email;
      user.name = req.body.username;
      user.img = req.body.image;
      user.save(function(err, user){
        req.session.user = user;
        res.redirect("/editprofile")     
      })
    })


  },

  editprofileview : function(req,res){
    res.view({user : req.session.user});
  },


  userview : function(req,res){
    req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
    // Project.findOne(req.query.projectId).done(function (err,project){   
    //   req.session.currentProject = project;
    //   Permission.find().done(function (err, permissions){
    //     User.find().done(function (err, users){        
          
    //       req.session.currentProject.permissions = [];
    //       perms = _.where(permissions, {project_id : project.id});
    //       _.each(perms, function (p){
    //         p.user = _.findWhere(users,{id:p.user_id});
    //         delete p.user_id;
    //         delete p.project_id;
    //         req.session.currentProject.permissions.push(p)
    //       });           
    //       console.log("lalala",req.session.currentProject)
    //       res.view({
    //         currentUser : JSON.stringify(req.session.user),
    //         //projectTitle : req.session.currentProject.title,
    //         projectId : req.session.currentProject.id,
    //         currentProject : JSON.stringify(req.session.currentProject),
    //       });
    //     });        
    //   });
    // }); 

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
  },
};
