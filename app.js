/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path'),
    upload = require('jquery-file-upload-middleware'),
    db = require("./db");

var app = express();


upload.configure({
    uploadDir: __dirname + '/public/uploads',
    uploadUrl: '/uploads'

});




// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/upload', upload.fileHandler());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));



app.use('/list', function (req, res, next) {
    upload.fileManager().getFiles(function (files) {
        //  {
        //      "00001.MTS": {
        //          "path": "/home/.../public/uploads/ekE6k4j9PyrGtcg+SA6a5za3/00001.MTS"
        //      },
        //      "DSC00030.JPG": {
        //          "path": "/home/.../public/uploads/ekE6k4j9PyrGtcg+SA6a5za3/DSC00030.JPG",
        //          "thumbnail": "/home/.../public/uploads/ekE6k4j9PyrGtcg+SA6a5za3/thumbnail/DSC00030.JPG"
        //      }
        //  }
        res.json(files);
    });
});


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/editor', function (req, res) {
    res.render('editor', { title: 'play editor' });
});

app.post('/editor/insert', function (req, res) {
    console.log("req")
    db.insert(req.body);
    res.send('hello world');
});
app.get('/editor/find', function (req, res) {
    db.find(function (doc) {
        res.send(doc.doc);
    })
});


// The endpoint for uploads


// Our delete route
app.delete('/uploads/:uuid', function (req, res) {
    var filename = settings.paths.uploads + "/" + req.params.uuid;

    fs.unlink(filename, function (err) {
        if (err != null) {
            console.log(">> Error!: " + err);
            res.send(JSON.stringify({}), { 'Content-type': 'application/json' }, 404);
        }
        else {
            console.log("File Deleted! " + filename);
            res.send(JSON.stringify({ success: true }), { 'Content-type': 'application/json' }, 200);
        }
    });
});


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
