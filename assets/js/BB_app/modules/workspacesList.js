/////////////////////////////////////////////////
var workspacesList = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (json) {
    this.views.main = new workspacesList.Views.Main({
        el : json.el,
        users : global.collections.Users, 
        user : global.models.current_user,
        display : json.display,
        projects : global.collections.Projects,
    });
    this.views.main.render();
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
workspacesList.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.users = json.users;
        this.user = json.user;
        this.workspaces = json.projects;
        this.display = json.display;
        // Events
        // Templates
        this.template_search = _.template($('#workspacesList-search-template').html());
    },
    events : {
        "keyup .search" : "search",
        "click .starred" : "starred",
        "click .unstarred" : "unstarred",
    },
    search : function(e){
        e.preventDefault();
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.workspaces.each(function(p){
            if(research.toLowerCase() == p.get('title').substr(0,research_size).toLowerCase()){
                matched.add(p);
            }
        });
        this.render_workspaces(this.json_worspaces);
    },
    starred : function(e){
        e.preventDefault();
        var id = e.target.getAttribute("data-id");
        this.workspaces.get(id).save({starred : true});
        this.render();
    },
    unstarred : function(e){
        e.preventDefault();
        var id = e.target.getAttribute("data-id");
        this.workspaces.get(id).save({starred : false});
        this.render();
    },
    render_workspaces : function(json){
        var _this = this;
        ////////////////////////////
        if(this.display == "list"){
            $('.workspaces_container_list').remove();
            var list_container = $('<div>',{class:'workspaces_container_list large-12 columns'});
            this.workspaces.each(function(ws){
                list_container.append(new workspacesList.Views.Workspace({
                    display : _this.display,
                    model   : ws
                }).render().el)
            })
            $(this.el).append(list_container)
        }else{
            $('.workspaces_container').remove();
            //////////////////
            // Starred
            var starred_ws = this.workspaces.where({starred : true});
            var starred_container = $('<div>',{class:'workspaces_container panel large-12 columns'});
            starred_container.append('<h4><img src="/img/icones/Shape-Star2-32-blue.png" />Starred workspaces</h4>')
            starred_ws.forEach(function(ws){
                starred_container.append(new workspacesList.Views.Workspace({
                    display : _this.display,
                    model   : ws,
                }).render().el)
            });
            $(this.el).append(starred_container);
            /////////////////
            // All 
            var all_ws_container = $('<div>',{class:'workspaces_container panel large-12 columns'});
            all_ws_container.append('<h4><img src="/img/icones/User-Profile-32-blue.png" />All workspaces</h4>')
            this.workspaces.each(function(ws){
                all_ws_container.append(new workspacesList.Views.Workspace({
                    display : _this.display,
                    model   : ws,
                }).render().el)
            })
            $(this.el).append(all_ws_container);
            $(".workspaces_container").gridalicious({width: 300});
        }
        $(document).foundation();
    },
    render : function(){        
        $(this.el).empty();
        $(this.el).append(this.template_search({
            display : this.display
        }));
        $(this.el).append(new workspacesList.Views.Formulaire({
            tagName : "div",
            className : "reveal-modal",
            id : "new_ws_modal_"+this.display,
            workspaces : this.workspaces,
            user : this.user
        }).render().el);
        this.render_workspaces(this.json_worspaces);
        $(document).foundation();
        return this;
    }
});

/////////////////////////////////////////////////
workspacesList.Views.Formulaire = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.user = json.user;
        this.workspaces = json.workspaces;
        // Events
        // Templates
        $(this.el).attr('data-reveal', '');
        this.template_form = _.template($('#workspacesList-form-template').html());
    },
    events : {
        "click .newWorkspace" : "newWorkspace"
    },
    newWorkspace : function(e){
        e.preventDefault();
        var title = $(this.el).find('#wks_title').val();
        var description = $(this.el).find('#wks_description').val();
        var organisation = $(this.el).find('#wks_organisation').val();
        var visibility = $(this.el).find('#wks_visibility').val();
        if(title != ""){
            var id = guid();
            new_workspace = new global.Models.ProjectModel({
                id:id,
                author : this.user,
                title: title,
                date: getDate(),
                date2:new Date().getTime(),
                image:"",
                content : description,
                backup:false,
                project:id,
                status : visibility
                //kLabels : [{color : "#27AE60", label:"Validated"},  {color : "#F39C12", label:"Processing"}, {color : "#C0392B", label:"Missing"}],
                //cLabels : [{color : "#27AE60", label:"Known"}, {color : "#F39C12", label:"Reachable"}, {color : "#C0392B", label:"Alternative"}]
            });
            new_workspace.save();
            this.workspaces.add(new_workspace);
            window.location.href = "/bbmap?projectId="+new_workspace.get('id');
        }else{
            $('.alertBox').html('<div data-alert class="alert-box alert radius">Problem : title<a href="#" class="close">&times;</a></div>')
        }
        
    },
    render : function(){        
        $(this.el).empty();
        $(this.el).append(this.template_form());
                
        return this;
    }
});
/////////////////////////////////////////////////
workspacesList.Views.Workspace = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.display = json.display;
        this.model = json.model;
        // Events
        // Templates
        this.template_list = _.template($('#workspacesList-list-template').html());
        this.template_block = _.template($('#workspacesList-block-template').html());
    },
    events : {},
    render : function(){        
        $(this.el).empty();
        ////////////////////////////
        // Define news style design
        var pulse = "no-pulse";
        var news_nbr = 0;
        var news  = global.collections.News;
        var _this = this;
        news.forEach(function(n){
            if(n.get('project') == _this.model.get('id')){
                pulse = "pulse";
                news_nbr ++;
            }    
        });
        ////////////////////////////
        if(this.display == "list"){
            $(this.el).append(this.template_list({
                pulse : pulse,
                news_nbr : news_nbr,
                project : this.model.toJSON()
            }));
        }else{
            $(this.el).append(this.template_block({
                pulse : pulse,
                news_nbr : news_nbr,
                project : this.model.toJSON(),
            }));
        }        
        return this;
    }
});
/////////////////////////////////////////////////
