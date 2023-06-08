const mongoose = require('mongoose');
const Account = mongoose.model('accounts');
const Tourney = mongoose.model('tourneys');

const argon2i = require('argon2-ffi').argon2i;
const crypto = require('crypto');

const passwordRegex = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{5,30})");

module.exports = app => {

    // Routes
    app.post('/account/login', async (req, res) => {

        var response = {  };
    
        const { rUsername, rPassword } = req.body;
        if(rUsername == null || !passwordRegex.test(rPassword)) {

            response.code = 1;
            response.msg = "Invalid credentials";

            res.send(response);
            return;
        }

        var userAccount = await Account.findOne( { username: rUsername }, 'username password');
        if(userAccount != null) 
        {
            // Account has been found
            console.log("Account has been found");

            argon2i.verify(userAccount.password, rPassword).then(async (success) => {
                if(success) {
                    userAccount.lastAuthentication = Date.now();
                    await userAccount.save();

                    response.code = 0;
                    response.msg = "Account found";
                    response.data = ( ({username}) => ({username})) (userAccount);
                    
                    res.send(response);
                    return;
                }
                else {
                    response.code = 1;
                    response.msg = "Invalid credentials";
                    res.send(response);
                    return;
                }
            });
        }
        else {
            response.code = 1;
            response.msg = "Invalid credentials";
            res.send(response);
            return;
        }
    });

    app.post('/account/create', async (req, res) => {

        var response = {  };
    
        const { rUsername, rPassword } = req.body;
        if(rUsername == null || rUsername.length < 3 || rUsername.length > 30) {
            response.code = 1;
            response.msg = "Invalid credentials";
            res.send(response);
            return;
        }

        if(!passwordRegex.test(rPassword)) {
            response.code = 3;
            response.msg = "Unsafe password";
            res.send(response);
            return;
        }

        var userAccount = await Account.findOne({ username: rUsername}, '_id');
        if(userAccount == null) {
            // Creating a new account
            console.log("Creating a new account...");

            // Generate a unique access token
            crypto.randomBytes(32, function(err, salt) {
                
                if(err) console.log(err);

                argon2i.hash(rPassword, salt).then(async (hash) => {

                    var newAccount = new Account({
                        username : rUsername,
                        password : hash,
                        salt: salt,
        
                        lastAuthentication : Date.now(),
                    });
                    await newAccount.save();

                    response.code = 0;
                    response.msg = "Account found";
                    response.data = ( ({username}) => ({username})) (newAccount);

                    res.send(response);
                    return;
                });
            });
        }

        else {
            response.code = 2;
            response.msg = "Username is already taken";
            res.send(response);
        }
        
        return;
    });

    app.post('/tourney/create', async (req, res) => {

        var response = { };

        const { tourneyOwner, tourneyName, nRounds, nPlayers, rankedPlayerList, roundList, scenarioList } = req.body;

        if (!tourneyOwner || !tourneyName || !nRounds || !nPlayers || !rankedPlayerList || !roundList || !scenarioList) {
            response.code = 1;
            response.msg = "Invalid data";
            res.send(response);
            return;
        }

        const tourney = await Tourney.findOne({ tourneyOwner: tourneyOwner, tourneyName: tourneyName });
        if (tourney == null) {
            // Creating a new tourney
            console.log("Creating a new tourney...");

            try {
                var newTourney = new Tourney({
                    tourneyOwner: tourneyOwner,
                    tourneyName: tourneyName,
                    nRounds: nRounds,
                    nPlayers: nPlayers,
                    rankedPlayerList: rankedPlayerList,
                    roundList: roundList,
                    scenarioList: scenarioList
                });
                await newTourney.save();
    
                response.code = 0;
                response.msg = "Tourney created";
                response.data = newTourney;
                
                res.send(response);
                return;
            } catch (error) {
                response.code = 1;
                response.msg = "Error creating tourney: " + error.message;
                res.send(response);
            }
        }
        else {
            response.code = 2;
            response.msg = "Tourney already exists";
            res.send(response);
        }

        return;
    });

    app.get('/tourney/get', async (req, res) => {

        var response = { };

        const rUsername = req.query.rUsername;

        if(rUsername == null) {
            response.code = 1;
            response.msg = "Invalid data";

            res.send(response);
            return;
        }

        const tourneys = await Tourney.find({ tourneyOwner: rUsername });
        if(tourneys != null) {
            // Tourneys have been found
            console.log("Tourney/s have been found");

            response.code = 0;
            response.msg = "Tourney found";
            response.data = tourneys;

            res.send(response);
            return;
        }
        else {
            response.code = 1;
            response.msg = "No tourneys have been found";

            res.send(response);
        }

        return;
    });
}

