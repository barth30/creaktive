/////////////////////////////////////////
// Users list
/////////////////////////////////////////
user.Views.Members = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.project = json.project;
        this.permissions = json.permissions;
        this.users   = json.users;
        this.users_render = this.users;
        this.eventAggregator    = json.eventAggregator;
        // Events
        this.eventAggregator.on('members_search', this.membersSearch, this);
        // Templates
        this.template_profil = _.template($('#user-profil-template').html());              
    },
    membersSearch: function(matched_members){
        this.users_render = matched_members;
        this.render();
    },
    render:function(){
        $(this.el).html('');
        //init
        users = this.users;

        users_linked = new Backbone.Collection();
        users_notlinked = new Backbone.Collection();
        this.permissions.each(function(permission){
            users_linked.add(users.get(permission.get('user_id')));
        });
        this.users_render.each(function(user){
            if(users_linked.get(user.get('id')) == undefined){users_notlinked.add(user)}
        });
        // on remplace user id par le model user ds les permissions
        this.permissions.each(function(permission){permission.set({user:users.get(permission.get("user_id"))})})
        // For each user
        $(this.el).append(this.template_profil({
            users_linked:this.permissions.toJSON(),
            users_notlinked:users_notlinked.toJSON()
        }));
        return this;
    }
});
/////////////////////////////////////////
// Main
/////////////////////////////////////////
user.Views.Main = Backbone.View.extend({
    el:"#user_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.project = json.project;
        this.users   = json.users;
        this.permissions = json.permissions;
        this.eventAggregator    = json.eventAggregator;

        // Events   
        this.permissions.bind("reset", this.render);
        this.permissions.bind("add", this.render);
        this.permissions.bind("remove", this.render);

        // Templates
        this.template_search = _.template($('#user-search-template').html());        
    },
    events : {
        "keyup .search" : "search",
        "click .addPermission" : "addPermission",
        "click .changePermission" : "changePermission"
    },
    addPermission : function(e){
        e.preventDefault();
        user_id_ = e.target.getAttribute('data-id-user');
        right_ = $("#"+e.target.getAttribute('data-id-user')+"_right").val();
        new_persmission = new global.Models.PermissionModel({
            id : guid(),
            right : right_,
            user_id : user_id_,
            project_id : this.project.id
        });
        // Intediction pour barth sauf les projets nomé poney
        user_ = this.users.get(user_id_);
        if((user_.get('name') == 'barth')&&(this.project.title != "poney")){
            alert("c'est mort doudou!");
        }else{
            new_persmission.save();
            this.permissions.add(new_persmission);
        }
        
    },
    changePermission : function(e){
        e.preventDefault();
        user_id = e.target.getAttribute('data-id-user');
        project_id = this.project.id;
        right_ = $("#"+e.target.getAttribute('data-id-user')+"_right").val();
        if(right_ == "u"){
            permissions_to_remove = this.permissions.filter(function(permission){return ((permission.get('project_id') == project_id) && (permission.get('user_id') == user_id))});
            permissions_to_remove.forEach(function(permission){
                permission.destroy();
            });    
        }else if((right_ == "r")||(right_=="rw")){
            permissions_to_update = this.permissions.filter(function(permission){return ((permission.get('project_id') == project_id) && (permission.get('user_id') == user_id))});
            permissions_to_update.forEach(function(permission){
                permission.set({"right":right_});
                permission.save();
            }); 
        }
        
    },
    search: function(e){
        e.preventDefault();
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.users.each(function(c){
            if(research.toLowerCase() == c.get('name').substr(0,research_size).toLowerCase()){
                matched.add(c);
            }
        });
        this.eventAggregator.trigger('members_search',matched);
    },
    render : function(){
        $(this.el).html("");
        // Init
        project = this.project;
        console.log(this.permissions)
        permissions_filtred = this.permissions.filter(function(permission){ 
            return permission.get('project_id') == project.id; 
        });
        permissions_collection = new Backbone.Collection();
        permissions_filtred.forEach(function(permission){
            permissions_collection.add(permission)
        });
        // Search bar
        $(this.el).append(this.template_search());        
        // User list
        $(this.el).append(
            new user.Views.Members({
                project : this.project,
                permissions : permissions_collection,
                users : this.users,
                eventAggregator : this.eventAggregator
            }).render().el
        );
    }
});
/***************************************/