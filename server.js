

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
app.use(express.static(__dirname + '/public'));

// Db connection with mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');
var mongoDB = mongoose.connection;
var itemDB; // constructor for item objects
var orderDB; // constructor for order objects


/********************************************************** */
/** Web Server endpoints */
/********************************************************** */

app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/admin', function (req, res) {
    res.render('admin.html');
});

app.get('/about', function (req, res) {
    res.render('about.html');
});

app.get('/contact', (req, res) => {
    res.render('contact.html');
});

/********************************************************** */
/** REST API endpoints */
/********************************************************** */


app.post('/api/items', (req, res) => {
    // create a db object
    var itemForMongo = itemDB(req.body);


    // validate the user is logged in
    // the user has permission to create new items
    // the item is not duplicated, not free

    // save the object
    itemForMongo.save(function (error, savedItem) {
        if (error) {
            console.log("Error saving item " + error);
            res.status(500); // 500 Internal Server Error
            res.send(error);
        }

        // no error
        res.status(201); // 201 Created
        res.json(savedItem);
    });
});

app.get('/api/items', (req, res) => {
    itemDB.find({}, function (error, data) {
        if (error) {
            res.status(500);
            res.send(error);
        }

        // no error
        res.json(data);
    });
});

app.get('/api/items/:user', (req, res) => {
    let name = req.params.user;

    itemDB.find({ user: name }, function (error, data) {
        if (error) {
            res.status(500);
            res.send(error);
        }

        // no error
        res.json(data);
    });

});

app.get('/api/items/search/:text', (req, res) => {
    var text = req.params.text;
    itemDB.find(
        {
            $or: [
                { title: { "$regex": text, "$options": "i" } },
                { description: { "$regex": text, "$options": "i" } }
            ]
        }
        , function (error, data) {
            if (error) {
                res.status(500);
                res.send(error);
            }

            // no error
            res.json(data);
        });
});


mongoDB.on('error', function (error) {
    console.log("Db connection error: " + error);
});

mongoDB.on('open', function () {
    console.log('Yeah, db connection opened');

    /* The allowed SchemaTypes are:
      String, Number, Date, Buffer, Boolean, Mixed, ObjectId, Array
    */

    // define schema for Db collection
    var itemSchema = mongoose.Schema({
        code: String,
        title: String,
        price: Number,
        description: String,
        category: String,
        image: String,
        user: String
    });

    // define order schema
    var orderSchema = mongoose.Schema({
        user: String,
        total: Number,
        status: Number,
        items: Array
    });

    itemDB = mongoose.model("catCohort8", itemSchema);
    orderDB = mongoose.model('ordersCohort8', orderSchema);

});



app.listen(8080, function () {
    console.log("Server running!! at http://localhost:8080");
});





// https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
//  https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
