/****************************************************************/
interface3.Views.Explorer = Backbone.View.extend({
    tagName:"div",
    className:"expand",
    initialize : function(json) {
        console.log("Interface3 Explorer view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.knowledges = json.knowledges;
        this.user = json.user;
        this.poches = json.poches;
        this.current_selection = json.current_selection;
    },
    render : function() {
        explorer_   = new explorer.Views.Main({
            knowledges:this.knowledges,
            user:this.user,
            poches:this.poches,
            current_selection:this.current_selection
        });
        $(this.el).append(explorer_.render().el);
        return this;
    }
});
/****************************************************************/
interface3.Views.Main = Backbone.View.extend({
    el : $('#interface3-container'),
    initialize : function(json) {
        console.log("interface3 view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.knowledges = json.knowledges;
        this.user = json.user;
        this.poches = json.poches;
        // Event aggregator
        this.current_selection = [];
        _.extend(this.current_selection, Backbone.Events);
    },
    render : function() {
        // Explorer
        explorer_   = new interface3.Views.Explorer({
            knowledges:this.knowledges,
            user:this.user,
            poches:this.poches,
            current_selection:this.current_selection
        });
        $(this.el).append(explorer_.render().el);
        $(document).foundation();

        return this;
    }
});
/****************************************************************/
