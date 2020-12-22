var express = require('express');
var router = express.Router();
const Multer = require('multer');
const Path = require('path');
const FsExtra = require('fs-extra');
const UuidV4 = require('uuid');

//set path and change file name for image upload
let storage = Multer.diskStorage({
  destination: function (req, file, callback) {
    FsExtra.mkdirsSync('./public/uploads/');
    FsExtra.mkdirsSync('./public/uploads/syllabus/');
    callback(null, './public/uploads/syllabus/');
  },
  filename: function (req, file, callback) {
    let syllabusDoc = UuidV4();
    callback(null, syllabusDoc + Path.extname(file.originalname.toLocaleLowerCase()));
  }
});

// image upload config
let upload = Multer({
  storage: storage,
  limits: {
    fileSize: 8 * 1024 * 1024 // 8 mb
  },
  fileFilter: function (req, file, cb) {
    let filetype = ['.pdf', '.doc'];
    if (filetype.indexOf(Path.extname(file.originalname).toLocaleLowerCase()) < '0') {
      return cb(new Error('File must be pdf, doc.'))
    }
    cb(null, true)
  }
}).single('syllabus');

/* add classes listing. */
router.post('/add', async (req, res, next) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        res.send({
          'type': "error",
          'message': err.message
        });
      } else {
        let classData = req.body;
        if (req.file && req.file.filename) {
          classData['syllabus'] = req.file.filename;
        }
        // Add class details in the database
        await db.models.classes.create(classData);
        res.send({
          'type': "success",
          'message': "Class added successfully"
        });
      }
    });
  } catch (error) {
    return res.send({
      type: 'error',
      error: error.message
    });
  }
});
/* GET classes listing. */
router.get('/list', async function (req, res, next) {
  try {
    try {
      // For pagination
      let page = 1;
      let limit = 20;
      if (req.query.page) {
        page = req.query.page;
      }
      let skip = limit * (page - 1);
      // for sorting
      let sort = {}
      if (!req.query.sort && !req.query.sort_field) {
        sort = {
          _id: -1
        };
      }
      //Find all
      let matchQuery = {
      }
      //Search by filter
      if (req.query.search) {
        //Regex Condition for search 
        matchQuery['$or'] = [{
          'title': {
            '$regex': req.query.search,
            '$options': 'i'
          }
        }, {
          'class': {
            '$regex': req.query.search,
            '$options': 'i'
          },
        }]
      }
      //List to all classes
      let classes = await db.models.classes.aggregate([{
          $lookup: {
            from: "colleges",
            let: {
              college_id: "$college"
            },
            pipeline: [{
              $match: {
                $expr: {
                  $and: [{
                    $eq: ["$_id", "$$college_id"]
                  }]
                }
              }
            }],
            as: "college"
          }
        }, {
          "$unwind": "$levels"
        }, {
          $lookup: {
            from: "levels",
            let: {
              level_id: "$levels"
            },
            pipeline: [{
              $match: {
                $expr: {
                  $and: [{
                    $eq: ["$_id", "$$level_id"]
                  }]
                }
              }
            }],
            as: "levels"
          }
        },
        {

          $project: {
            class: 1,
            title: 1,
            college: {
              $arrayElemAt: ["$college.name", 0]
            },
            levels: {
              $arrayElemAt: ["$levels", 0]
            }
          }
        },
        {
          "$group": {
            "_id": "$_id",
            "levels": {
              "$push": "$levels"
            },
            "college": {
              "$first": "$college"
            },
            "title": {
              "$first": "$title"
            },
            "class": {
              "$first": "$class"
            }
          }
        },
        {

          $project: {
            class: 1,
            title: 1,
            college: 1,
            levels: 1
          }
        },
        {
          $match: matchQuery
        },
        {
          $sort: sort
        },
        {
          $skip: skip
        },
        {
          $limit: limit
        }
      ]);
      //Total count of classes
      let count = await db.models.classes.countDocuments(matchQuery);
      //Render page using above all details
      res.render('classes/list', {
        title: 'Classes List',
        layout: 'layout',
        classes,
        search: req.query.search,
        status: req.query.status,
        start_record: skip + 1,
        end_record: skip + classes.length,
        total_records: count,
        pagination: {
          page: page,
          totalPage: Math.ceil(count / limit),
          url: req.originalUrl
        }
      });
    } catch (err) {
      console.log(err);
      res.render('classes/list', {
        title: 'Classes List',
        layout: 'layout',
      });
    }
  } catch (error) {
    return res.send({
      type: 'error',
      error: error.message
    });
  }
});

router.get("/loadCollege", async (req, res) => {
  try {
    let college = await db.models.colleges.find().lean();
    return res.send({
      'type': "success",
      college
    });
  } catch (error) {
    return res.send({
      type: 'error',
      error: error.message
    });
  }
})

router.get("/loadLevels", async (req, res) => {
  try {
    let levels = await db.models.levels.find().lean();
    return res.send({
      'type': "success",
      levels
    });
  } catch (error) {
    return res.send({
      type: 'error',
      error: error.message
    });
  }
})

router.put('/:id', async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        res.send({
          'type': "error",
          'message': err.message
        });
      } else {
        let updateD = req.body;
        if (req.file && req.file.filename) {
          updateD['syllabus'] = req.file.filename;
        }
        await db.models.classes.updateOne({
          _id: req.params.id
        }, updateD);
        return res.send({
          type: 'success',
          message: 'Class has been updated successfully.'
        });
      }
    });
  } catch (error) {
    return res.send({
      type: 'error',
      error: error.message
    });
  }
});


router.get('/:id', async (req, res) => {
  try {
    let classR = await db.models.classes.findOne({
      _id: req.params.id
    }).lean();
    return res.send({
      type: 'success',
      classR
    });
  } catch (error) {
    return res.send({
      type: 'error',
      error: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let deleteC = await db.models.classes.deleteOne({
      _id: req.params.id
    });
    return res.send({
      type: 'success',
      message: 'Class has been deleted successfully.'
    });
  } catch (error) {
    return res.send({
      type: 'error',
      error: error.message
    });
  }
})
module.exports = router;