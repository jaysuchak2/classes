/**
 * Script is used for setup db first time
 */

global.models = null //load all models in global conn var.
global.conn = null;
//import config file
global.config = require('../config/config.js');
let ObjectId = require('mongoose').Types.ObjectId;
//create client of mongo
const MongoClient = require('mongodb').MongoClient;
//get dbConfig
let dbConfig = config['database'];
//create database connection uri for central db
let database = 'mongodb://' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.database;
//connect database
MongoClient.connect(database, async function (err, client) {
    if (!err) {
        console.log('==============>Central db connected');
        // Add the new user to the admin database
        const db = client.db(dbConfig.database);
        let models = require('../models').models;

        let date = new Date();
        //create college lis
        let collegeData = [{
            name: "VJM",
            createdAt: date,
            updatedAt: date
        }, {
            name: "Marwadi",
            createdAt: date,
            updatedAt: date
        }, {
            name: "Atmiya",
            createdAt: date,
            updatedAt: date
        }, {
            name: "Gardi",
            createdAt: date,
            updatedAt: date
        }, {
            name: "Nirma",
            createdAt: date,
            updatedAt: date
        }];
        let levels = [{
            "level": "web app",
            createdAt: date,
            updatedAt: date
        }, {
            "level": "web design",
            createdAt: date,
            updatedAt: date
        }, {
            "level": "desktop app",
            createdAt: date,
            updatedAt: date
        }, {
            "level": "mobile app",
            createdAt: date,
            updatedAt: date
        }, {
            "level": "networking",
            createdAt: date,
            updatedAt: date
        }];


        try {
            await models.colleges.create(collegeData);
            console.log('==============>Colleges created');
            await models.levels.insertMany(levels);
            console.log('==============>Levels inserted');
        } catch (err) {
            console.log(err)
            console.log('==============>College and levels not created');
        };
        process.exit();
    } else {
    console.log('==============>Error while connect db');
    console.log(err);
}
});