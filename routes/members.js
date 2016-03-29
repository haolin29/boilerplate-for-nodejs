var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// Using use will make sure that every requests that hits this controller will pass through these functions.
router.use(bodyParser.urlencoded({ extened: true }));
router.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));



//build the REST operations at the base for members
//this will be accessible from http://127.0.0.1:3000/member if the default route for / is left unchanged
router.route('/')
    //GET all members
    .get(function(req, res, next) {
        //retrieve all members from Monogo
        mongoose.model('member').find({}, function(err, members) {
            if (err) {
                return console.error(err);
            } else {
                //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                res.format({
                    //HTML response will render the index.jade file in the views/members folder. We are also setting "members" to be an accessible variable in our jade view
                    html: function() {
                        // res.render('members/index', {
                        //       title: 'All my members',
                        //       "members" : members
                        //   });
                        //   to be revise
                    },
                    //JSON response will show all members in JSON format
                    json: function() {
                        res.json(memberinfo);
                    }
                });
            }
        });
    })
    //POST a new member
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var name = req.body.Membername;
        var BasicInfo = req.body.BasicInfo;
        //... to do

        //call the create function for our database
        mongoose.model('member').create({
            name: Membername,
            // to do
        }, function(err, member) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                //member has been created
                console.log('POST creating new member: ' + member);
                res.format({
                    //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function() {
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("members");
                        // And forward to success page
                        res.redirect("/members");
                    },
                    //JSON response will show the newly created member
                    json: function() {
                        res.json(member);
                    }
                });
            }
        })
    });



/* GET New Memember page. */
router.get('/new', function(req, res) {
    res.render('members/new', { title: 'Add New Member' });
});

// check the member by id
router.route('/:id')
    .get(function(req, res) {
        mongoose.model('member').findById(req.id, function(err, member) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                console.log('GET Retrieving ID: ' + member._id);
                var memberName = member.Membername.toISOString();
                res.format({
                    html: function() {
                        res.render('members/show', {
                            "memberName": memberName,
                        });
                    },
                    json: function() {
                        res.json(member);
                    }
                });
            }
        });
    });



//GET the individual member by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the member within Mongo
    mongoose.model('member').findById(req.id, function(err, member) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the blob
            console.log('GET Retrieving ID: ' + member._id);
            //format the date properly for the value to show correctly in our edit form
            var memberName = member.Membername.toISOString();
            res.format({
                html: function() {
                    res.render('members/show', {
                        "memberName": memberName,
                    });
                },
                json: function() {
                    res.json(member);
                }
            });
        }
    });
});


//PUT to update a blob by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var name = req.body.Membername;


    //find the document by ID
    mongoose.model('member').findById(req.id, function(err, blob) {
        //update it
        member.update({
            name: name,
            // todo
        }, function(err, memberID) {
            if (err) {
                res.send("There was a problem updating the information to the database: " + err);
            } else {
                //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                res.format({
                    html: function() {
                        res.redirect("/members/" + member._id);
                    },
                    //JSON responds showing the updated values
                    json: function() {
                        res.json(member);
                    }
                });
            }
        })
    });
});


//DELETE a Member by ID
router.delete('/:id/edit', function(req, res) {
    //find member by ID
    mongoose.model('member').findById(req.id, function(err, blob) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            blob.remove(function(err, member) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + member._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                        html: function() {
                            res.redirect("/members");
                        },
                        //JSON returns the item with the message that is has been deleted
                        json: function() {
                            res.json({
                                message: 'deleted',
                                item: member
                            });
                        }
                    });
                }
            });
        }
    });
});


module.exports = router;