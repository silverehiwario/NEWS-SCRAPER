// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");


// Routes
// =============================================================
module.exports = function(app) {


    // GET route for getting all of the jobs
    app.get("/api/jobs", function(req, res) {
        console.log('admin view')

var sequelize = require('sequelize');
   db.Job.findAll({
          
            // attributes:  [[sequelize.fn('IFNULL', sequelize.col('TechnicianId'), 'Not Assigned'),'TechnicianId'],'client_name', 'services', 'job_status'],
            // include: [{ model: db.Technician, attributes: ['location', 'current_job'] }],

        
            where: {
              job_status: ["inProgress","accepted","hold","assign","completed"]
            },
            attributes: ['id', 'client_name', 'specific_service', 'client_location', 'job_status'],
            include: [{ model: db.Technician, attributes: ['name'] }],


            // [sequelize.fn('DATE_FORMAT', sequelize.col('Job.createdAt'), '%m-%d-%Y'), 'createdAt']

        }).then(function(dbJob) {
            console.log('line 28', dbJob)
            console.log("...................")
            // console.log(dataValues.description)
            // res.json(dbJob);
            res.render("viewjob", { Job: dbJob });
        });
    });

    // POST route for saving a new job

    // If a user sends data to add a new job...
    app.post("/api/new", function(req, res) {

        // Then add the job to the database using sequelize

        db.Job.create({
                client_name: req.body.client_name,
                client_location: req.body.client_location,
                client_contact: req.body.client_contact,
                services: req.body.services,
                specific_service: req.body.specific_service,
            })
            .then(function(result) {
                res.redirect("/api/accept/");
            });
    });

    app.get("/api/accept/", function(req, res) {
        db.Job.findAll({
                where: {
                    job_status: "unaccepted"
                }
            })
            .then(function(result) {
                // return res.json(result);
                res.render("accept", { Job: result });
            });
    });

    // Delete a Job
    app.post("/api/delete", function(req, res) {
        console.log("Job Data:");
        console.log(req.body);
        db.Job.destroy({
                where: {
                    id: req.body.job_id
                }
            })
            .then(function(result) {
                res.redirect("/api/accept")
            })
    });

    app.post("/api/update", function(req, res) {
        db.Job.update({
                job_status: "accepted"
            }, {
                where: {
                    id: req.body.job_id
                }
            })
            .then(function(result) {
                res.redirect("/api/accept")
            })
    });
    // Get Route for Periodic Reports
    app.get("/api/getDate", function(req, res) {
        console.log('req.body');
        var sequelize = require('sequelize');
        db.Job.findAll({
            attributes: ['id','client_name', 'specific_service', 'client_location', [sequelize.fn('DATE_FORMAT', sequelize.col('Job.createdAt'), '%m-%d-%Y'), 'createdAt'], 'job_status'],
            where: {
                createdAt: {
                    $between: [req.query.startdate, req.query.endDate]
                }
            },
            include: [{ model: db.Technician, attributes: ['name'] }]
        }).then(function(result) {
            console.log("...................")
            console.log('line 28', result)
            console.log("...................")
            res.render("weekly", { Job: result });

        });
    });
    // Get for monthly report
    app.get("/api/getDetails", function(req, res) {
        var sequelize = require('sequelize');
        db.Job.findAll({
            attributes: ['id', 'client_name', 'specific_service', 'client_location', [sequelize.fn('DATE_FORMAT', sequelize.col('Job.createdAt'), '%m-%d-%Y'), 'createdAt'], 'job_status'],
            where: sequelize.where(sequelize.fn('DATE_FORMAT', sequelize.col('Job.createdAt'), '%b-%Y'), req.query.date3),
            include: [{ model: db.Technician, attributes: ['name'] }]
        }).then(function(result) {
            console.log('line 28', result)
            console.log("...................")
            res.render("monthlyReport", { Job: result });

        });
    });

    //----------------------------------------
    // Routes for assign page
    //----------------------------------------
    app.get("/api/assign/", function(req, res) {
        db.Job.findAll({
                where: {
                    job_status: ["hold","accepted","assign","inProgress"]
                }
            })
            .then(function(result) {
                console.log(result);
                // return res.json(result);
                res.render("assign", { Job: result });
            });
    });


    // Getting information from the skillset table
    app.get("/api/Skillsets", function(req, res) {
        // findAll returns all entries for a table when used with no options
        db.Skillset.findAll({}).then(function(dbSkillset) {
            // We have access to the todos as an argument inside of the callback function
            console.log(dbSkillset);
            res.json(dbSkillset);
        });
    });


    // Getting information from the Technicians Table
    app.get("/api/Technicians", function(req, res) {
        // findAll returns all entries for a table when used with no options
        db.Technician.findAll({}).then(function(dbTechnician) {
            // We have access to the technicians as an argument inside of the callback function
            console.log(dbTechnician);
            res.json(dbTechnician);
        });
    });

    app.post("/api/update2", function(req, res) {

        console.log("skill: " + req.body.skill);
        console.log("job id: " + req.body.ID);
        console.log("job_status: " + req.body.Status);
        console.log("Technician: " + req.body.Technician);

        // Then add the job to the database using sequelize
        db.Job.update({
                job_status: req.body.Status,
                TechnicianId: req.body.Technician,
            }, {
                where: {
                    id: req.body.ID,
                }
            }),
            db.Technician.update({
                job_status: req.body.Status,
                current_job: req.body.ID,
            }, {
                where: {
                    id: req.body.Technician,
                }
            }).then(function(result) {
                console.log(result);
                res.json(result);
            });
    });

};
