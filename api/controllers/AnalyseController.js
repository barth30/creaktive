/**
 * AnalyseController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  analyseview : function(req,res){
    req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
    Project.findOne(req.query.projectId).done(function(err, project){
      req.session.currentProject = project;
      res.view({
        currentUser : JSON.stringify(req.session.user),
        projectTitle : req.session.currentProject.title,
        projectId : req.session.currentProject.id,
        currentProject : JSON.stringify(req.session.currentProject)
      });
    });
  }

};
