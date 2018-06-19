const express = require('express')
const app = express()
const port = 3000
const paladins = require('paladins-api');
const exphbs = require('express-handlebars');
require('dotenv').config({path: './config/process.env'})

/* Handlebars Engine Config */

app.engine('handlebars', exphbs({ defaultLayout: 'main' })); 
app.set('view engine', 'handlebars');

/* dotenv API credentials */

const pal = new paladins(
    process.env.DEV_ID,  // SECURITY: add your own Paladins developer id as environment variable
    process.env.AUTH_KEY // Same for your auth key
)

/* Paladins temporary session creator */

var sessionId;
pal.connect('PC', (err, res) => {
    if (!err) {
        sessionId = res;
    }
})

/* Routes */

app.get('/', (request, response) => {
    response.send('API Up & Running!')
})

app.get('/paladins/player/:player', (request, response) => {
    let player = request.params.player;
    if (sessionId) {
        pal.getChampionRanks(sessionId, 'PC', player, (err, res) => {
            console.log(res);
            response.send(res);
        });
    }
});

app.get('/paladins/profile/:player', (request, response) => {
    let player = request.params.player;
    if(sessionId) {
        pal.getPlayer(sessionId, 'PC', player, (err, res) => {
            console.log(res);
            response.send(res);
        });
    }
});

app.get('/paladins/matches/:player', (request, response) => {
    let player = request.params.player;
    if (sessionId) {
        pal.getMatchHistory(sessionId, 'PC', player, (err, data) => {
            response.send(data);
            console.log(data[0])
        });
    }
});

app.get('/paladins/lastmatch/:player', (request, response) => {
    let player = request.params.player;
    if (sessionId) {
        pal.getMatchHistory(sessionId, 'PC', player, (err, data) => {
            response.send(data);
            console.log(data[0])
        });
    }
});

app.get('/paladins/match/:match', (request, response) => {
    let match = request.params.match;
    if (sessionId) {
        pal.getMatchDetails(sessionId, 'PC', match, (err, data) => {
            response.send(data);
            console.log(data[0])
        });
    }
});

/* Server port config */

app.listen(port, (err) => {
    if (err) { return console.log('Error launching server: ', err) }
    console.log(`Listening on ${port}`)
})