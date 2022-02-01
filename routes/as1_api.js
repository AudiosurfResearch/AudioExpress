var express = require('express');
var bodyParser = require('body-parser');
var xml2js = require('xml2js');
var router = express.Router();
const builder = new xml2js.Builder();

router.post('/game_AttemptLogin_unicodepub64.php', function(req, res, next) {
    res.contentType('text/html');
    res.charset = "utf-8";
    res.connection.setKeepAlive(false);
    res.shouldKeepAlive = false;
    
    console.log(req.rawTrailers);
    //TODO: replace hardcoded values with values from a proper database, etc.
    //We're gonna need proper auth too
    const statusString = require('crypto').createHash('md5').update("ntlr78ouqkutfc" + req.body.loginorig + "47ourol9oux").digest("hex");
    const userInfoResponse = {
        RESULT: {
            $: {
                status: statusString
            },
            userid: 1,
            username: 't3stm4n',
            locationid: 1, // locationid is the n-th element in the location list you see when registering
            steamid: '133742069' //SteamID32, not ID64
        }
    };
    
    console.log("Attempting login for user " + userInfoResponse.RESULT.username);
    res.send(builder.buildObject(userInfoResponse));
});

router.post('/game_fetchsongid_unicodePB.php', function(req, res, next) {
    const personalBestResponse = {
        RESULT: {
            $: {
                status: 'allgood'
            },
            songid: 1337, //TODO: Make it look up the song artist and name from a database to get an ID
            pb: 690000
        }
    };

    console.log("Looking up PB of user ID " + req.body.uid + " on " + req.body.artist + " - " + req.body.song);
    res.send(builder.buildObject(personalBestResponse));
});

router.post('/game_customnews_unicode2.php', function(req, res, next) {
    const customNewsResponse = {
        RESULTS: {
            TEXT: "Powered by AudioExpress\nEnjoy the ride!"
        }
    };

    console.log("Retrieving custom news for user ID " + req.body.uid);
    res.send(builder.buildObject(customNewsResponse));
});

router.post('/game_nowplaying_unicode_testing.php', function(req, res, next) {
    res.send("done");
});

router.post('/game_sendride25.php', function(req, res, next) {
    const sendRideResponse = {
        RESULT: {
            $: {
                status: 'allgood'
            },
            songid: req.body.songid, //TODO: Make it look up the song artist and name from a database to get an ID
        }
    };

    console.log("Received ride on song " + req.body.artist + " - " + req.body.song + " with score of " + req.body.score);
    res.send(builder.buildObject(sendRideResponse));
});

router.post('/game_fetchscores6_unicode.php', function(req, res, next) {
    const sendRideResponse = {
        RESULTS: {
            scores: [{
                $: {
                    scoretype: 0
                },
                league:{
                    $: {
                        leagueid: 1
                    },
                    ride: {
                        username: "your_mother",
                        vehicleid: 1,
                        score: 6999999,
                        ridetime: 1592413531,
                        feats: "Match11",
                        songlength: 23844,
                        trafficcount: 179792
                    }
                }
            },
            {
                $: {
                    scoretype: 1
                },
                league:{
                    $: {
                        leagueid: 1
                    },
                    ride: {
                        username: "deez_nuts",
                        vehicleid: 1,
                        score: 6999999,
                        ridetime: 1592413531,
                        feats: "Match11",
                        songlength: 23844,
                        trafficcount: 179792
                    }
                }
            }]
        }
    };

    console.log("Received ride on song " + req.body.artist + " - " + req.body.song + " with score of " + req.body.score);
    res.send(builder.buildObject(sendRideResponse));
});

module.exports = router;