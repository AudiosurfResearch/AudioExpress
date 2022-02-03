var express = require('express');
var bodyParser = require('body-parser');
var xml2js = require('xml2js');
var router = express.Router();
const builder = new xml2js.Builder();
const database = require('../database');
const { Op } = require('sequelize');

router.post('/game_AttemptLogin_unicodepub64.php', function (req, res, next) {
    res.contentType('text/html');
    res.charset = "utf-8";
    res.connection.setKeepAlive(false);
    res.shouldKeepAlive = false;

    console.log(req.rawTrailers);
    //TODO: replace hardcoded values with values from a proper database, etc.
    //We're gonna need proper auth too
    const statusString = require('crypto').createHash('md5').update("ntlr78ouqkutfc" + req.body.loginorig + "47ourol9oux").digest("hex");
    (async function () {
        console.log("Attempting login for user " + req.body.email);

        var user = await database.User.findOne({
            where: {
                [Op.and]: [
                    { username: req.body.email },
                    { gamepassword: req.body.pass }
                ]
            }
        });

        var userInfoResponse;
        if (user != null) {
            userInfoResponse = {
                RESULT: {
                    $: {
                        status: statusString
                    },
                    userid: user.id,
                    username: user.username,
                    locationid: user.locationid, // locationid is the n-th element in the location list you see when registering
                    steamid: user.steamid32 //SteamID32, not ID64
                }
            };
        }
        else {
            userInfoResponse = {
                RESULT: {
                    $: {
                        status: "failed"
                    }
                }
            };
        }

        res.send(builder.buildObject(userInfoResponse));
    })();
});

router.post('/game_fetchsongid_unicodePB.php', function (req, res, next) {
    console.log("Looking up PB of user ID " + req.body.uid + " on " + req.body.artist + " - " + req.body.song);

    (async function () {
        var song = await database.Song.findOne({
            where: {
                [Op.and]: [
                    { artist: req.body.artist },
                    { title: req.body.song }
                ]
            }
        });

        if (song == null) {
            song = await database.Song.create({
                title: req.body.song,
                artist: req.body.artist,
                //TODO: Add musicbrainzid
            });
        }

        var pb = await database.Score.findOne({
            where: {
                [Op.and]: [
                    { songid: song.id },
                    { userid: req.body.uid },
                    { leagueid: req.body.league }
                ]
            }
        });

        var personalBestResponse = {
            RESULT: {
                $: {
                    status: "allgood"
                },
                songid: song.id,
                pb: 0
            }
        };
        if (pb != null) {
            personalBestResponse.RESULT.pb = pb.score;
        }

        res.send(builder.buildObject(personalBestResponse));
    })();
});

router.post('/game_customnews_unicode2.php', function (req, res, next) {
    const customNewsResponse = {
        RESULTS: {
            TEXT: "Powered by AudioExpress\nEnjoy the ride!"
        }
    };

    console.log("Retrieving custom news for user ID " + req.body.uid);
    res.send(builder.buildObject(customNewsResponse));
});

router.post('/game_nowplaying_unicode_testing.php', function (req, res, next) {
    res.send("done");
});

router.post('/game_sendride25.php', function (req, res, next) {
    console.log("Received ride on song " + req.body.artist + " - " + req.body.song + " with score of " + req.body.score);

    (async function () {
        var user = await database.User.findOne({
            where: {
                [Op.and]: [
                    { username: req.body.email },
                    { gamepassword: req.body.pass }
                ]
            }
        });

        var song = await database.Song.findOne({
            where: {
                [Op.and]: [
                    { artist: req.body.artist },
                    { title: req.body.song }
                ]
            }
        });

        var sendRideResponse;
        if (user != null && song != null) {
            sendRideResponse = {
                RESULT: {
                    $: {
                        status: 'allgood'
                    },
                    songid: song.id
                }
            };

            var prevScore = await database.Score.findOne({
                where: {
                    [Op.and]: [
                        { userid: user.id },
                        { songid: song.id },
                        { leagueid: req.body.league }
                    ]
                }
            });

            if (prevScore != null) {
                prevScore.destroy();
            }

            await database.Score.create({
                songid: song.id,
                userid: user.id,
                leagueid: req.body.league,
                trackshape: req.body.trackshape,
                density: req.body.density,
                xstats: req.body.xstats,
                iss: req.body.iss,
                isj: req.body.isj,
                songlength: req.body.songlength,
                ridetime: Math.floor(new Date().getTime() / 1000),
                goldthreshold: req.body.goldthreshold,
                feats: req.body.feats,
                vehicleid: req.body.vehicle,
                score: req.body.score
            });
        }
        else {
            sendRideResponse = {
                RESULT: {
                    $: {
                        status: "failed"
                    }
                }
            };
        }

        res.send(builder.buildObject(sendRideResponse));
    })();
});

router.post('/game_fetchscores6_unicode.php', function (req, res, next) {
    const fetchScoresResponse = {
        RESULTS: {
            scores: [{
                $: {
                    scoretype: 0
                },
                league: {
                    $: {
                        leagueid: 1
                    },
                    ride: {
                        username: "scoretype_0",
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
                league: {
                    $: {
                        leagueid: 1
                    },
                    ride: {
                        username: "scoretype_1",
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
                    scoretype: 2
                },
                league: {
                    $: {
                        leagueid: 1
                    },
                    ride: {
                        username: "scoretype_2",
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

    res.send(builder.buildObject(fetchScoresResponse));
});

module.exports = router;