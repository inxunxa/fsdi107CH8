

var express = require('express');
var app = express(); // create the app

/********************************************************** */
/** configurations */
/********************************************************** */

// enable CORS
// FOR TEST ONLY ( not in PROD )
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Rquested-With, Content-Type, Accept");
    next();
});

// config body-parser to read request payload
var bparser = require('body-parser');
app.use(bparser.json());

// Render HTML using EJS
var ejs = require('ejs');
app.set('views', __dirname + '/public');
app.engine('html', ejs.renderFile);
app.set('view engine', ejs);

// To Server static files (css, js, images, pdf, doc, .... )
app.use(express.static( __dirname + '/public'));


/********************************************************** */
/** Web Server endpoints */
/********************************************************** */

app.get('/', function(req, res) {
    res.render('index.html');
});

app.get('/admin', function(req, res) {
    res.render('admin.html');
});

app.get('/about', function(req, res){
    res.render('about.html');
});

app.get('/contact', (req, res) => {
    res.render('contact.html');
});

/********************************************************** */
/** REST API endpoints */
/********************************************************** */

var db = [];
var lastId = 1;

app.post('/api/items', (req, res) => {
    var item = req.body;

    // asign a unique ID
    item.id = lastId;
    lastId += 1;

    // save the object
    db.push(item);

    res.status(201); // Created!
    res.json(item);
});

app.get('/api/items', (req, res) => {
    console.log("Client wants the DB");
    res.json(db);
});


// Ctrl + p = Search
// ctrl + b = hide/show files
// run the server 3000
// Localhost -> myself (computer)
// 127.0.0.1 [home] -> myself
// CORS => Cross Origin Resource Sharing
app.listen(8080, function(){
    console.log("Server running!! at http://localhost:8080");
});





// https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
//  https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
