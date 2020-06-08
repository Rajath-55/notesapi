const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const Note = require('../models/note')

router.get('/', (req,res,next) => {
    Note.find()
    .select("title content _id")
    .exec()
    .then(docs => {
        const response = {
            count : docs.length,
            notes : docs.map(doc => {
                return {
                    
                    title : doc.title,
                    content : doc.content,
                    _id : doc.id,
                    request : {
                        type : 'GET',
                        url : 'http://localhost:3000/notes/' + doc.id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.header(500).json({ message : 'DataBase Error on the Server'});
    })
    
});


router.post('/', (req,res,next) => {
    const note = new Note ({
        
        title : req.body.title,
        content : req.body.content,
        _id : new mongoose.Types.ObjectId()
    });
    note.save()
    .then(result => {
        res.status(201).json({
            message : "New Note added Successfully!",
            createdNote : {
                
                title : result.title,
                content : result.content,
                _id : result.id,
                request : {
                    type : 'GET', 
                    url : 'http://localhost:3000/notes/' + result.id
                }
            }
        })
        .catch(err => console.log(err));
    })
})

module.exports = router;