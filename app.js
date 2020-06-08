const express = require('express');
const app = express();

const mongoose = require('mongoose');

const morgan = require('morgan');

const bodyParser = require('body-parser');

const noteRoutes = require('./api/routes/notes');

mongoose.connect('mongodb+srv://Rajath:Rajath2000@cluster0-ajgkh.mongodb.net/Cluster0?retryWrites=true&w=majority', {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

mongoose.Promise = global.Promise;


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());


//PREVENT CORS ERRORS
app.use((req,res,next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');

    if(req.method ==='OPTIONS'){
        res.header('Acess-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();

})

app.use('/notes', noteRoutes);


//Catch errors
app.use((req,res,next) =>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);

})

app.use((error, req,res,next) =>{
    res.status(error.status || 500);
    res.json({
        error: {
            message : error.message
        }
    })
});





module.exports = app;