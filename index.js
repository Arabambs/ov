const express = require('express');
const bodyParser = require("body-parser");
const OverAndUnder = require("./OverAndUnder");

// Create a new express application instance
const app = express();
// connects to the server
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("www"));

app.get("/users/:uname", (req, res) => {
    res.end("Hello " + req.params.uname);
});

let oGames = {};
//endpoint made for twilio(twilio is a gatee way for responding to messages even face book has a gate way)
app.post("/sms", (req, res) =>{
    let sFrom = req.body.From || req.body.from;
    if(!oGames.hasOwnProperty(sFrom)){
        oGames[sFrom] = new OverAndUnder();
    }
    let sMessage = req.body.Body|| req.body.body;
    oGames[sFrom].makeAMove(sMessage, (aReply) =>{
        res.setHeader('content-type', 'text/xml');
        let sResponse = "<Response>";
        for(let n = 0; n < aReply.length; n++){
            sResponse += "<Message>";
            sResponse += aReply[n];
            sResponse += "</Message>";
        }
        res.end(sResponse + "</Response>");
    
    });

});

var port = process.env.PORT || parseInt(process.argv.pop()) || 3000;

app.listen(port, () => console.log('Example app listening on port ' + port + '!'));
