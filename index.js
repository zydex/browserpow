const express = require('express')
const app = express()
const port = 3000
const crypto = require('crypto');

const difficulty = 4

app.set('view engine', 'ejs');
app.use(express.json());

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/challenge', (req, res) => {
    var randGen = (Math.random()).toString() + req.ip
    var challenge = crypto.createHash('sha256').update(randGen).digest('hex');
    res.send(JSON.stringify(`{"challenge": "${challenge}", "difficulty": ${difficulty}}`))
})

app.post('/verify', (req, res) => {
    const [sentHash, sentNonce, challenge] = [req.body["hash"], req.body["nonce"], req.body["challenge"]]
    var verifyHash = crypto.createHash('sha256').update(challenge + sentNonce).digest('hex');
    if (verifyHash == sentHash) {
        res.sendStatus(200)
    } else {
        res.sendStatus(403)
    }
})

app.listen(port, () => {
    console.log(`POW server listening at port: ${port}`)
})