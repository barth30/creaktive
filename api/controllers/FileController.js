/**
 * FileController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */


/********** FILE UPLOAD ********/

var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
//var html5pdf = require("html5-to-pdf");
var UPLOAD_PATH = 'upload';


function safeFilename(name) {
	name = name.replace(/ /g, '-');
	name = name.replace(/[^A-Za-z0-9-_\.]/g, '');
	name = name.replace(/\.+/g, '.');
	name = name.replace(/-+/g, '-');
	name = name.replace(/_+/g, '_');
	return name;
}

function fileMinusExt(fileName) {
	return fileName.split('.').slice(0, -1).join('.');
}

function fileExtension(fileName) {
	return fileName.split('.').slice(-1);
}

// Where you would do your processing, etc
// Stubbed out for now
function processImage(id, name, path, cb) {

	cb(null, {
		'result': 'success',
		'id': id,
		'name': name,
		'path': path
	});
};

function cleanName(name){
  return name.replace(/[ùûü]/g,"u").replace(/[îï]/g,"i").replace(/[àâä]/g,"a").replace(/[ôö]/g,"o").replace(/[éèêë]/g,"e").replace(/ç/g,"c").replace(/ /g,"");
}





module.exports = {


  export2pdf : function(req,res){
    //console.log('Processing export to pdf')

      var html =req.body.data;
      // var images = req.body.images

      // $ = cheerio.load(html)
      // $('img').each(function(i,elem){
        
      //   //console.log(elem)
      // });
      id = IdService.guid(),
      fileName = "export.pdf";
      dirPath = UPLOAD_PATH + '/' + id;
      filePath = dirPath + '/' + fileName;
      outputPath = filePath;
      html5pdf().from.string(html).to(outputPath, function () {
        res.send(outputPath)
      })
  },


  get: function (req, res) {
  	res.download(req.body.path);
     rimraf('upload/', function(err) {
       if (err) cb(err)
     })
  },

  destroy : function (req,res){
   rimraf('upload/'+req.body.file.id, function(err) {
     if (err) cb(err)
     res.send({msg:"destroyed"})
   })
 },

 upload: function(req, res) {
  var file = req.files[0];

  async.auto({

    metadata : function(next){
      id = IdService.guid(),
      fileName = safeFilename(file.name),
      dirPath = UPLOAD_PATH + '/' + id,
      filePath = dirPath + '/' + fileName;

      next(null,{
        id: id,
        fileName : fileName,
        dirPath : dirPath,
        filePath : filePath
      })
    },

    writeFile : ["metadata", function(next, r){


      try {
        mkdirp.sync(dirPath, 0755);
      } catch (e) {
        //console.log(e);
      }

      fs.readFile(file.path, function (err, data) {
        if (err) {
          res.json({'error': 'could not read file'});
        } else {
          fs.writeFile(r.metadata.filePath, data, function (err) {
            if (err) {
              res.json({'error': 'could not write file to storage'});
            } else {
              processImage(id, r.metadata.fileName, r.metadata.filePath, function (err, data) {
                if (err) {
                  res.json(err);
                } else {
                  res.json(data);
                  next()
                }
              });
            }
          })
        }
      });
    }]

  },function(err){
    if(err) res.send(err)
  })
},

};
