var express = require('express');
var router = express.Router();
const pgp = require('pg-promise')();
const db = pgp("postgres://rviygylevbdzxb:e39cc062f951d77ec147892abaeeed3096bc6b037747e3155fdc5640696201c9@ec2-23-23-221-255.compute-1.amazonaws.com:5432/dev109plbu13s8");
/* GET home page. */
router.post('/init', function(req, res, next) {
  db.any("SELECT * FROM portfolios WHERE userid=${user};",{user:req.body.userId})
      .then(room => {
        console.log(room);
        if(room.length==0) {
          db.none("INSERT INTO portfolios VALUES (${user},${port});",{user:request.userId,port:{}});
        }
    })
      .catch(error => {
        console.log(error);
    });
});

module.exports = router;
