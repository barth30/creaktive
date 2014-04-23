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
  init: function (json,callback) {
    //Variables
    this.models.current_user = new this.Models.User(json.user); ; 
    this.models.currentProject = new this.Models.ProjectModel(json.project);

    console.log("******* Connected as ", this.models.current_user.get("name"), " on ", this.models.currentProject.get("title"))
    this.eventAggregator = {};//this.concepts.first();
    _.extend(this.eventAggregator, Backbone.Events);

    this.collections.Knowledges = new this.Collections.Knowledges(json.knowledges);
    this.collections.Users = new this.Collections.UsersCollection(json.users);
    this.collections.Poches = new this.Collections.Poches(json.poches);
    this.collections.Projects = new this.Collections.ProjectsCollection(json.projects);
    this.collections.Concepts = new this.Collections.ConceptsCollection(json.concepts);
    this.collections.Links = new this.Collections.CKLinks(json.links);
    this.collections.Permissions = new this.Collections.PermissionsCollection(json.permissions);
    // Notifications
    this.collections.all_notifs = new this.Collections.NotificationsCollection(json.notifications);
    this.collections.all_notifs.on('add',this.prepareNotifications,this)
    this.collections.all_notifs.on('remove',this.prepareNotifications,this)
    this.collections.all_notifs.on('change',this.prepareNotifications,this)
    this.collections.personal_notifs = new Backbone.Collection();
    this.collections.knowledge_notifs = new Backbone.Collection();
    this.collections.concept_notifs = new Backbone.Collection();
    this.collections.category_notifs = new Backbone.Collection();
    this.prepareNotifications();
  
    callback();
  },
  prepareNotifications : function(){
    // init
    this.collections.personal_notifs.reset();
    this.collections.knowledge_notifs.reset();
    this.collections.concept_notifs.reset();
    this.collections.category_notifs.reset();
    // On fait un premier tri en ne gardant que les notifications non valider pour cet utilisateur
    this.collections.all_notifs.each(function(notif){
      if((_.indexOf(notif.get('read'), global.models.current_user.get('id')) == -1)){
        global.collections.personal_notifs.add(notif);
      }
    });
    // Puis on les reparties dans les collections correspondantes pour les préparer pour les différents modules
    this.collections.personal_notifs.each(function(notif){
      if(notif.get('object') == "Knowledge"){
        global.collections.knowledge_notifs.add(notif);
      }else if(notif.get('object') == "Concept"){
        global.collections.concept_notifs.add(notif);
      }else if(notif.get('object') == "Category"){
        global.collections.category_notifs.add(notif);
      }
    });

    console.log("all",global.collections.all_notifs.length)
    console.log("all",global.collections.personal_notifs.length)
    console.log("kno",global.collections.knowledge_notifs.length)
    console.log("con",global.collections.concept_notifs.length)
    console.log("cat",global.collections.category_notifs.length)
  },
  initManager :function (user, callback) {
    //Variables
    this.models.current_user = new this.Models.User(JSON.parse(user)); 
    console.log("******* Connected as ", this.models.current_user.get("name"))
    this.eventAggregator = {};//this.concepts.first();
    _.extend(this.eventAggregator, Backbone.Events);

    this.collections.Knowledges = new this.Collections.Knowledges();
    this.collections.Users = new this.Collections.UsersCollection();
    this.collections.Poches = new this.Collections.Poches();
    this.collections.Projects = new this.Collections.ProjectsCollection();
    this.collections.Concepts = new this.Collections.ConceptsCollection();
    this.collections.Links = new this.Collections.CKLinks();
    this.collections.all_notifs = new this.Collections.NotificationsCollection();
    this.collections.Permissions = new this.Collections.PermissionsCollection();
    // Notifications
    this.collections.all_notifs = new this.Collections.NotificationsCollection();
    this.collections.all_notifs.on('add',this.prepareNotifications,this)
    this.collections.all_notifs.on('remove',this.prepareNotifications,this)
    this.collections.all_notifs.on('change',this.prepareNotifications,this)
    this.collections.personal_notifs = new Backbone.Collection();
    this.collections.knowledge_notifs = new Backbone.Collection();
    this.collections.concept_notifs = new Backbone.Collection();
    this.collections.category_notifs = new Backbone.Collection();
    this.prepareNotifications();

    // Fetch
    global.collections.Users.fetch({reset:true,complete:function(){},success:function(){
      global.collections.Knowledges.fetch({reset: true,success:function(){
        global.collections.Poches.fetch({reset: true,success:function(){
          global.collections.Projects.fetch({reset:true,success:function(){
            global.collections.Concepts.fetch({reset:true,success:function(){
              global.collections.Links.fetch({reset:true,success:function(){
                global.collections.all_notifs.fetch({reset:true,success:function(){
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
    this.views.Main.render()
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
var welcome = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    this.views.Main = new this.Views.Main({
      notifications : global.collections.personal_notifs || global.collections.all_notifs,
      user : global.models.current_user
    });
    this.views.Main.render();
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
      notifications : global.collections.concept_notifs,
      concepts    : global.collections.Concepts,
      project     : global.models.currentProject,
      user        : global.models.current_user,
      knowledges  : global.collections.Knowledges,
      poches      : global.collections.Poches,
      links       : global.collections.Links,
      eventAggregator : global.eventAggregator
    }); 
    this.views.Main.render();
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
      notifications   : global.collections.category_notifs,
      knowledges  : global.collections.Knowledges,
      poches      : global.collections.Poches,
      user        : global.models.current_user,
      eventAggregator : global.eventAggregator,
    });   
    this.views.Main.render()
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
      notifications   : global.collections.personal_notifs || global.collections.all_notifs,
      user            : global.models.current_user,
      eventAggregator : global.eventAggregator
    });
    this.views.Main.render();
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
    this.views.Main.render()
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
      a_notifications : global.collections.all_notifs,
      k_notifications : global.collections.knowledge_notifs,
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
    this.views.main.render()
  }
};
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

