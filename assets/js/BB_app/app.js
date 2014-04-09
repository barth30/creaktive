//////////////////////////////////////////////
// Global object
//////////////////////////////////////////////
var global = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (currentUser, currentProject, callback) {
    //Variables
    this.models.current_user = new this.Models.User(JSON.parse(currentUser)); 
    this.models.currentProject = new this.Models.ProjectModel(currentProject); 
    console.log("******* Connected as ", this.models.current_user.get("name"), " on ", this.models.currentProject.get("title"))
    this.eventAggregator = {};//this.concepts.first();
    _.extend(this.eventAggregator, Backbone.Events);

    this.collections.Knowledges = new this.Collections.Knowledges();
    this.collections.Users = new this.Collections.UsersCollection();
    this.collections.Poches = new this.Collections.Poches();
    this.collections.Projects = new this.Collections.ProjectsCollection();
    this.collections.Concepts = new this.Collections.ConceptsCollection();
    this.collections.Links = new this.Collections.CKLinks();
    this.collections.Notifications = new this.Collections.NotificationsCollection();
    this.collections.Permissions = new this.Collections.PermissionsCollection();

    // Fetch
    global.collections.Users.fetch({reset:true,complete:function(){},success:function(){
      global.collections.Knowledges.fetch({reset: true,data : {projectId : global.models.currentProject.get('id')},success:function(){
        global.collections.Poches.fetch({reset: true,data : {projectId : global.models.currentProject.get('id')},success:function(){
          global.collections.Projects.fetch({reset:true,success:function(){
            global.collections.Concepts.fetch({reset:true,data : { projectId : global.models.currentProject.get('id') },success:function(){
              global.collections.Links.fetch({reset:true,data : {projectId : global.models.currentProject.get('id')},success:function(){
                global.collections.Notifications.fetch({reset:true,data : {projectId : global.models.currentProject.get('id')},success:function(){
                  global.collections.Permissions.fetch({reset:true,success:function(){
      
                  }});
                }});
              }});
            }});        
          }});      
        }});    
      }});  
    }}); 
  
    callback();

  },
  initManager :function (currentUser, callback) {
    //Variables
    this.models.current_user = new this.Models.User(JSON.parse(currentUser)); 
    console.log("******* Connected as ", this.models.current_user.get("name"))
    this.eventAggregator = {};//this.concepts.first();
    _.extend(this.eventAggregator, Backbone.Events);

    this.collections.Knowledges = new this.Collections.Knowledges();
    this.collections.Users = new this.Collections.UsersCollection();
    this.collections.Poches = new this.Collections.Poches();
    this.collections.Projects = new this.Collections.ProjectsCollection();
    this.collections.Concepts = new this.Collections.ConceptsCollection();
    this.collections.Links = new this.Collections.CKLinks();
    this.collections.Notifications = new this.Collections.NotificationsCollection();
    this.collections.Permissions = new this.Collections.PermissionsCollection();

    // Fetch
    global.collections.Users.fetch({reset:true,complete:function(){},success:function(){
      global.collections.Knowledges.fetch({reset: true,success:function(){
        global.collections.Poches.fetch({reset: true,success:function(){
          global.collections.Projects.fetch({reset:true,success:function(){
            global.collections.Concepts.fetch({reset:true,success:function(){
              global.collections.Links.fetch({reset:true,success:function(){
                global.collections.Notifications.fetch({reset:true,success:function(){
                  global.collections.Permissions.fetch({reset:true,success:function(){
      
                  }});
                }});
              }});
            }});        
          }});      
        }});    
      }});  
    }}); 
  
    callback();
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////
// MANAGER PART
/////////////////////////////////////////////////////////////////////////////////////////////
var analyse = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    /*Init*/
    this.views.Main = new this.Views.Main({
      concepts : global.collections.Concepts,
      knowledges : global.collections.Knowledges,
      links : global.collections.Links,
      eventAggregator : global.eventAggregator
    }); 
  }
};
/////////////////////////////////////////////////
var manager = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    /*Init*/
    this.views.Main = new this.Views.Main({
      permissions : global.collections.Permissions,
      projects    : global.collections.Projects,
      concepts    : global.collections.Concepts,
      knowledges  : global.collections.Knowledges,
      experts     : global.collections.Users,
      poches      : global.collections.Poches,
      links       : global.collections.Links,
      users       : global.collections.Users,
      user        : global.models.current_user,
      eventAggregator : global.eventAggregator
    }); 
  }
};
/////////////////////////////////////////////////
var conceptsmap = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    /*Init*/
    this.views.Main = new this.Views.Main({
      notifications : global.collections.Notifications,
      concepts    : global.collections.Concepts,
      project     : global.models.currentProject,
      user        : global.models.current_user,
      knowledges  : global.collections.Knowledges,
      poches      : global.collections.Poches,
      links       : global.collections.Links,
      eventAggregator : global.eventAggregator
    });   
  }
};
/////////////////////////////////////////////////
var category = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    /*Init*/
    this.views.Main = new this.Views.Main({
      knowledges  : global.collections.Knowledges,
      poches      : global.collections.Poches,
      user        : global.models.current_user,
      eventAggregator : global.eventAggregator,
    });   
  }
};
/////////////////////////////////////////////////
var topbar = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (page) {
    /*Init*/
    this.views.Main = new this.Views.Main({
      notifications   : global.collections.Notifications,
      project         : global.models.currentProject,
      projects        : global.collections.Projects,
      concepts        : global.collections.Concepts,
      knowledges      : global.collections.Knowledges,
      experts         : global.collections.Users,
      poches          : global.collections.Poches,
      links           : global.collections.Links,
      user            : global.models.current_user,
      users           : global.collections.Users,
      eventAggregator : global.eventAggregator
    }); 
  }
};
/////////////////////////////////////////////////
var title = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (_project,_page) {
    /*Init*/
    this.views.Main = new this.Views.Main({
      project           : _project,
      page              : _page,
      user              : global.models.current_user,
      eventAggregator   : global.eventAggregator
    });  
    this.views.Main.render();
  }
};
/////////////////////////////////////////////////
var user = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (project_) {
    /*Init*/
    this.views.Main = new this.Views.Main({
      project     : project_,
      users       : global.collections.Users,
      permissions : global.collections.Permissions,
      eventAggregator : global.eventAggregator
    });  
  }
};
/////////////////////////////////////////////////
var explorer = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    /*Init*/
    this.views.main = new this.Views.Main({
      notifications : global.collections.Notifications,
      projects    : global.collections.Projects,
      concepts    : global.collections.Concepts,
      knowledges  : global.collections.Knowledges,
      experts     : global.collections.Users,
      poches      : global.collections.Poches,
      links       : global.collections.Links,
      user        : global.models.current_user,
      eventAggregator : global.eventAggregator,
      style       : "grid"

    });
  }
};
/////////////////////////////////////////////////
// var notification = {
//   // Classes
//   Collections: {},
//   Models: {},
//   Views: {},
//   // Instances
//   collections: {},
//   models: {},
//   views: {},
//   init: function () {
//     /*Init*/
//     this.views.Main = new this.Views.Main({
//       notifications : global.collections.Notifications,
//       project: global.models.currentProject,
//       projects    : global.collections.Projects,
//       concepts    : global.collections.Concepts,
//       knowledges  : global.collections.Knowledges,
//       experts     : global.collections.Users,
//       poches      : global.collections.Poches,
//       links       : global.collections.Links,
//       user        : global.models.current_user,
//       users : global.collections.Users,
//       eventAggregator : global.eventAggregator
//     });

//   }
// };
/////////////////////////////////////////////////
var cklink = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    /*Init*/

  }
};
/////////////////////////////////////////////////
var comments = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {}
};
/////////////////////////////////////////////////
var attachment = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {}
};
/////////////////////////////////////////////////
var concepts = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    /*Init*/

  }
};
/////////////////////////////////////////////////
