const express = require('express');

const app = express();

// Routes
app.get('/auth', async (req, res) => {
    console.log(req.query);
    res.send("empezando ");
});

const port = 13756; // quizas cambiar?
app.listen(port, () => {
    console.log("Listening on " + port);
});