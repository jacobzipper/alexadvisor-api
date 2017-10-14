var express = require('express');
var router = express.Router();
const pgp = require('pg-promise')();
const db = pgp("postgres://rviygylevbdzxb:e39cc062f951d77ec147892abaeeed3096bc6b037747e3155fdc5640696201c9@ec2-23-23-221-255.compute-1.amazonaws.com:5432/dev109plbu13s8");
/* GET home page. */
router.post('/init', function(req, res, next) {
  db.any("SELECT * FROM portfolios WHERE userid=${user};",{user:req.body.userId})
      .then(user => {
        console.log(user);
        if(user.length==0) {
          db.none("INSERT INTO portfolios VALUES (${user},${port});",{user:req.body.userId,port:{}});
        }
        res.json({error:1});
    })
      .catch(error => {
        console.log(error);
        res.json({error:2});
    });
});
router.post('/addStocks', function(req, res, next) {
  db.one("SELECT portfolio FROM portfolios WHERE userid=${user};",{user:req.body.userId})
      .then(user => {
        console.log(user);
        if(user.length==0) {
            var objtemp = {}
            objtemp[req.body.ticker] = req.body.num;
          db.none("INSERT INTO portfolios VALUES (${user},${port});",{user:req.body.userId,port:objtemp});
        }
        else {
            console.log(user["portfolio"]);
            var port = user["portfolio"];
            console.log(port);
            var stocks = Object.keys(port);
            if(stocks.indexOf(req.body.ticker)!=-1) {
                port[req.body.ticker]+=req.body.num;
            }
            else {
                port[req.body.ticker] = req.body.num;
            }
            db.none("UPDATE portfolios SET portfolio=${portf} WHERE userid=${user};",{user:req.body.userId,portf:port});
        }
        res.json({error:1});
    })
      .catch(error => {
        console.log(error);
        res.json({error:2});
    });
});

router.post('/subStocks', function(req, res, next) {
  db.one("SELECT portfolio FROM portfolios WHERE userid=${user};",{user:req.body.userId})
      .then(user => {
        console.log(user);
        if(user.length!=0) {
            console.log(user["portfolio"]);
            var port = user["portfolio"];
            console.log(port);
            var stocks = Object.keys(port);
            if(stocks.indexOf(req.body.ticker)!=-1) {
                port[req.body.ticker]-=req.body.num;
                port[req.body.ticker] = port[req.body.ticker] > 0 ? port[req.body.ticker] : 0;
                if (port[req.body.ticker] == 0) {
                    delete port[req.body.ticker];
                }
            }
            db.none("UPDATE portfolios SET portfolio=${portf} WHERE userid=${user};",{user:req.body.userId,portf:port});
        }
        res.json({error:1});
    })
      .catch(error => {
        console.log(error);
        res.json({error:2});
    });
});

router.post('/getStocks', function(req, res, next) {
  db.one("SELECT portfolio FROM portfolios WHERE userid=${user};",{user:req.body.userId})
      .then(user => {
        console.log(user);
        if(user.length!=0) {
            res.json({port:user["portfolio"]});
        }
        res.json({error:1});
    })
      .catch(error => {
        console.log(error);
        res.json({error:2});
    });
});

module.exports = router;
