/**
* Copyright 2016 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

const express = require('express');
const path = require('path');
var http = require('http');
const bodyParser = require("body-parser");
const formidable = require('formidable');
var cors = require('cors');
var fs = require('fs');
var buffer = require('buffer');
var multer = require('multer');
var cred = require('./credentials.json');
const app = express();
var server = http.createServer(app);

var port = 8080;

server.listen(port);
console.log('::: Visit ' + 'http://localhost:' + port + ' :::');

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({limit: '50mb'}));

const viewsDir = path.join(__dirname);
app.use(express.static(viewsDir));
app.use(express.static(path.join(__dirname, '/public')));

app.use(cors());

// Image Storage in root
var Storage = multer.diskStorage({
  destination: function(req, file, callback) {
      callback(null, "./");
  },
  filename: function(req, file, callback) {
      callback(null, file.fieldname + '.jpg');
  }
});

var upload = multer({
  storage: Storage
}).array("imgUploader", 3); //Field name and max count


app.get("/", function(req, res) {
  res.end("O.K.");
});

app.post("/api/Upload", function(req, res) {
  upload(req, res, function(err) {
      if (err) {
          return res.end("Something went wrong!");
      }
      return res.end("File uploaded sucessfully!.");
  });
});

app.get("/watson", (req, res) => {

  var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

    var visualRecognition = new VisualRecognitionV3({
          version: '2018-03-19',
          iam_apikey: cred.vrapi  
        });
    
    var images_file= fs.createReadStream('imgUploader.jpg');

    var imageparams = {
      // url: myimage
      images_file: images_file
    };
    
    visualRecognition.detectFaces(imageparams, function(err, response) {
      if (err)
      res.send(err);
      else
      {
      var obj = JSON.stringify(response, null, 2);
      var imagedetails=JSON.parse(obj);
      dict = []
      dict.push({
        age:   imagedetails["images"][0]["faces"][0]["age"]["min"],
        agescore: imagedetails["images"][0]["faces"][0]["age"]["score"],
        gender:imagedetails["images"][0]["faces"][0]["gender"]["gender"],
        genderscore:imagedetails["images"][0]["faces"][0]["gender"]["score"]
     });
      res.json(dict);
      }
    });

});

app.get("/test", (req, res) => {

  var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

    var visualRecognition = new VisualRecognitionV3({
          version: '2018-03-19',
          iam_apikey: cred.vrapi  
        });
    
    var images_file= fs.createReadStream('test.jpg');

    var imageparams = {
      // url: myimage
      images_file: images_file
    };
    
    visualRecognition.detectFaces(imageparams, function(err, response) {
      if (err)
      res.send(err);
      else
      {
      var obj = JSON.stringify(response, null, 2);
      var imagedetails=JSON.parse(obj);
      dict = []
      dict.push({
        age:   imagedetails["images"][0]["faces"][0]["age"]["min"],
        agescore: imagedetails["images"][0]["faces"][0]["age"]["score"],
        gender:imagedetails["images"][0]["faces"][0]["gender"]["gender"],
        genderscore:imagedetails["images"][0]["faces"][0]["gender"]["score"]
     });
      res.json(dict);
      }
    });

});

