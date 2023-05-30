const mongoose = require('mongoose');
const Account = mongoose.model('accounts');

module.exports = app => {

    // Routes
    app.post('/account/login', async (req, res) => {
    
        const { rUsername, rPassword } = req.body;
        if(rUsername == null || rPassword == null) {
            res.send("Invalid Credentials");
            return;
        }

        var userAccount = await Account.findOne({ username: rUsername});
        if(userAccount != null) 
        {
            if(rPassword == userAccount.password) {
                userAccount.lastAuthentication = Date.now();
                await userAccount.save();

                console.log("Retrieving account...");
                res.send(userAccount);
                return;
            }
        }

        res.send("Invalid Credentials");
        return;
    });

    app.post('/account/create', async (req, res) => {
    
        const { rUsername, rPassword } = req.body;
        if(rUsername == null || rPassword == null) {
            res.send("Invalid Credentials");
            return;
        }

        var userAccount = await Account.findOne({ username: rUsername});
        if(userAccount == null) {
            // Create new account
            console.log("Create new account...");
        
            var newAccount = new Account({
                username : rUsername,
                password : rPassword,

                lastAuthentication : Date.now(),
            });
            await newAccount.save();
        
            res.send(newAccount);
            return;
        }

        else {
            res.send("Username is already taken");
        }
        
        return;
    });
}

