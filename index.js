var express     = require('express');
var bodyParser  = require('body-parser');
var shell       = require('shelljs');
var app         = express();
var os          = require('os');
var http        = require('http');

// Get local ip address (accessible remotely)
function getLocalIp() {
    var netIFaces = os.getNetworkInterfaces();
    var ips = netIFaces[process.env.LOCAL_NETWORK];
    var ip = '127.0.0.1';
    if(ips != null && ips instanceof Array) {
        for(var i=0; i<ips.length; i++) {
            if(ips[i].family !== 'IPv4') {
                continue;
            }
            ip = ips[i].address;
        }
    }
    return ip;
}

var hostname    = getLocalIp();
var port        = 3000;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('etag', false);
app.use(bodyParser.json({limit: '2mb'}));

var httpServer = http.createServer(app);

app.post('/locations', function(req, res, next){
    console.log('\n\n****************************** Got the location data *****************************');

    var locArr = req.body;
    var result = [];

    if(locArr instanceof Array && locArr.length > 0 && locArr[0].time != null) {
        locArr.map(function(loc) {
            var readableTime = new Date(loc.time);
            loc.readableTime = readableTime;
            result.push(loc);
        });
    }
    else {
        result = locArr;
    }

    //console.log('\nHeaders @@@@@@:\n', req.headers);
    //console.log('\nBody ######\n', result);
    //res.json(result);

    console.log(result);
    res.sendStatus(200);
});
httpServer.listen(port, hostname, function() {
    shell.exec('clear');
    console.log('****************************** Server is Running *****************************');
    console.log('*        You can access the server on: http://' + hostname + ':' + port + '             *');
    console.log('******************************************************************************');
});
//test
