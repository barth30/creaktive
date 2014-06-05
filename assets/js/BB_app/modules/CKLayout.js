/////////////////////////////////////////
// MODULE
/////////////////////////////////////////
var CKLayout = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    // Concept labels
    CKLayout.collections.CLabels = new CKLayout.Collections.Labels();
    CKLayout.collections.CLabels.add(new CKLayout.Models.Label({id:guid(),title:"Known",color:"#27AE60"}));
    CKLayout.collections.CLabels.add(new CKLayout.Models.Label({id:guid(),title:"Reachable",color:"#F39C12"}));
    CKLayout.collections.CLabels.add(new CKLayout.Models.Label({id:guid(),title:"Alternative",color:"#C0392B"}));
    // Knowledge Labels
    CKLayout.collections.KLabels = new CKLayout.Collections.Labels();
    CKLayout.collections.KLabels.add(new CKLayout.Models.Label({id:guid(),title:"Validated",color:"#27AE60"}));
    CKLayout.collections.KLabels.add(new CKLayout.Models.Label({id:guid(),title:"Processing",color:"#F39C12"}));
    CKLayout.collections.KLabels.add(new CKLayout.Models.Label({id:guid(),title:"Missing",color:"#C0392B"}));
  }
};
/////////////////////////////////////////
// Models & collections
/////////////////////////////////////////
CKLayout.Models.Label = Backbone.Model.extend({
    defaults : {
        id : "",
        title : "",
        color : ""
    },
    initialize : function Label() {
        //console.log('Filter explorer Constructor');
        this.bind("error", function(model, error){
            //console.log( error );
        });
    }
});
/***************************************/
CKLayout.Collections.Labels = Backbone.Collection.extend({
    model : CKLayout.Models.Label,
    initialize : function() {
        //console.log('Filters explorer collection Constructor');
        this.bind("error", function(model, error){
            //console.log( error );
        });
    }
});
/////////////////////////////////////////
// VIEWS
/////////////////////////////////////////
CKLayout.Views.Modal = Backbone.View.extend({
    el:"#CKLayoutModal",
    initialize:function(json){
        _.bindAll(this, 'render', 'openModelEditorModal');
        // Variables
        this.models_notifs         = json.models_notifs
        this.model              = new Backbone.Model();
        this.user               = json.user;
        this.collection         = json.collection;
        this.eventAggregator    = json.eventAggregator;
        // Element
        this.content_el         = $(this.el).find('#cklayout_content_container');
        this.activities_el      = $(this.el).find('#cklayout_activities_container');
        // Events
        this.eventAggregator.on("closeModelEditorModal", this.closeModelEditorModal);
        this.eventAggregator.on("openModelEditorModal", this.openModelEditorModal);
    },
    closeModelEditorModal : function(){
        $(this.el).foundation('reveal', 'close');
    },
    openModelEditorModal : function(id){
        this.model = this.collection.get(id);
        collection_test = new Backbone.Collection();
        if(this.model.get('type') == 'project') collection_test = new global.Collections.ProjectsCollection(this.model);
        else if(this.model.get('type') == 'knowledge') collection_test = new global.Collections.Knowledges(this.model);
        else if(this.model.get('type') == 'category') collection_test = new global.Collections.Poches(this.model);
        else if(this.model.get('type') == 'concept') collection_test = new global.Collections.ConceptsCollection(this.model);
        collection_test.fetch({complete:function(){}});
        this.render(function(){
            $('#CKLayoutModal').foundation('reveal', 'open'); 
            try{
                $(document).foundation();
            }catch(err){
                console.log(err);
            }
        }); 
    },
    render:function(callback){
        this.content_el.empty();
        this.activities_el.empty();
        this.content_el.append(new CKLayout.Views.Main({
            activities_el : this.activities_el,
            className : "panel row",
            models_notifs : this.models_notifs,
            model : this.model,
            user : this.user,
            eventAggregator : this.eventAggregator
        }).render().el);
        // Render it in our div
        if(callback) callback();
    }
});
/***************************************/
CKLayout.Views.Main = Backbone.View.extend({
    initialize:function(json){
        _.bindAll(this, 'render');
        CKLayout.init(); // Pour instancier les labels
        // Variables
        this.activities_el      = json.activities_el;
        this.model              = json.model;
        this.models_notifs         = json.models_notifs       
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
        this.labels             = new Backbone.Collection();
        ////////////////////
        // Label
        if(this.model.get('type') == "concept"){
            this.labels = CKLayout.collections.CLabels;
        }else if(this.model.get('type') === "knowledge"){
            this.labels = CKLayout.collections.KLabels;
        }
        ///////////////////
        // Notifications
        // _this = this;
        // if(this.model.get('type') != "project"){
        //     this.notifications.each(function(notification){
        //         if(notification.get('to').id == _this.model.get('id')){_this.notif_to_render.add(notification)}
        //     });
        // }else{
        //     this.notif_to_render.add(this.notifications.where({project_id : this.model.get('id')}))
        // }
        // Events
        this.model.on('change',this.render,this)
        // Templates
        this.template_hearder = _.template($('#CKLayout-header-template').html());
        this.template_footer = _.template($('#CKLayout-footer-template').html());
    },
    events : {
        "click .updateLabel" : "updateLabel",
        "click .toConcept" : "convertInConcept",
        "click .toKnowledge" : "convertInKnowledge",
        "click .toCategory" : "convertInCategory",
        "click .remove" : "closeModelEditorModal"
    },
    convertInConcept : function(e){
        e.preventDefault();
        newModel = new global.Models.ConceptModel(this.model.toJSON());
        console.log("newModel",newModel)
        newModel.set({id_father : "none"});
        console.log("newModel",newModel)
        newModel.save();
        this.model.destroy();
        this.eventAggregator.trigger('closeModelEditorModal');
    },
    convertInKnowledge : function(e){
        e.preventDefault();
        newModel = new global.Models.Knowledge(this.model.toJSON());
        newModel.save();
        this.model.destroy();
        this.eventAggregator.trigger('closeModelEditorModal');
    },
    convertInCategory : function(e){
        e.preventDefault();
        newModel = new global.Models.Poche(this.model.toJSON());
        newModel.save();
        this.model.destroy();
        this.eventAggregator.trigger('closeModelEditorModal');
    },
    closeModelEditorModal : function(e){
        e.preventDefault();
        _this = this;
        ///////////////////////////////////////
        // Si c'est une category on doit supprimer le tag qui référence cette category
        if(this.model.get('type') == "category"){
            if (confirm("If you delete this category, the system will delete the reference in each knowledge, would you continue?")) {
                // change knowledge reference
                global.collections.Knowledges.each(function(knowledge){
                    knowledge.set({
                        tags : _.without(knowledge.get('tags'),_this.model.get('title')),
                        date : getDate(),
                        user : _this.user
                    }).save();
                });
                this.model.destroy();
                this.eventAggregator.trigger('removeCategory',this.model.get('id'));
            }
        ///////////////////////////////////////    
        }else{
            if (confirm("All references attached to this item will also be removed, would you continue?")) {
                this.eventAggregator.trigger('closeModelEditorModal');
                this.model.destroy();
            }
        }
        
    },
    updateLabel : function(e){
        e.preventDefault();
        this.model.save({
            color:e.target.getAttribute("data-label-color"),
            label:e.target.getAttribute("data-label-title")
        });
        if(this.model.get('type') === "concept") this.eventAggregator.trigger("updateMap")
        this.render();
    },
    render:function(){
        $(this.el).empty();
        this.activities_el.empty();
        _this = this;
        // Header
        $(this.el).append(this.template_hearder({
            model:this.model.toJSON(),
            labels:this.labels.toJSON()
        }));
        // Model editor module
        $(this.el).append(new modelEditor.Views.Main({
            
            user            : this.user,
            model           : this.model,
            eventAggregator : this.eventAggregator
        }).render().el);
        // IMG List module
        $(this.el).append(new imagesList.Views.Main({
            
            model           : this.model,
            eventAggregator : this.eventAggregator
        }).render().el);
        // Attachment module
        $(this.el).append(new attachment.Views.Main({
            
            model           : this.model,
            eventAggregator : this.eventAggregator
        }).render().el);
        // Comments module
        $(this.el).append(new comments.Views.Main({
            
            model           : this.model,
            user            : this.user,
            eventAggregator : this.eventAggregator
        }).render().el);
        
        // notification module
        this.activities_el.append(new activitiesList.Views.Main({
            className       : "row panel",
            model           : this.model,
            models_notifs   : this.models_notifs,
            eventAggregator : this.eventAggregator
        }).render().el);
        // Footer
        $(this.el).append(this.template_footer({model:this.model.toJSON()}));
        $(document).foundation();

        return this;
    }
});