const { Client } = require('pg');
const express = require('express')
var cors = require('cors')
const app = express()
const port = 3001
app.use(express.json());
// var corsOptions = {
//   origin: 'http://localhost:8080/',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
app.use(cors())
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'onto_metrics',
    password: '480798',
    port: 3000,
});

client.connect();


app.get('/classes', async (req, res) => {
    const version_number = req.query.version_number
    let query = ""
    if (version_number){
        query = `SELECT cl.* FROM "class" as cl
        left join vocabulary_metrics as voc
        on voc.id = cl.vocabulary_id
        where voc.name in (
            SELECT name FROM vocabulary_metrics
            GROUP BY name
            HAVING count(*)>=${version_number}
        )`;
    } else {
        query = `SELECT * FROM class`;
    }
    client.query(query, (err, res1) => {
        if (err) {
            console.error(err);
            return;
        }
        res.json({ classes: res1.rows })
    });
})


app.get('/vocabularies', async (req, res) => {
    const version_number = req.query.version_number
    let query = ""
    if (version_number){
        query = `SELECT * FROM vocabulary_metrics
        where name in (
            SELECT name FROM vocabulary_metrics
            GROUP BY name
            HAVING count(*)>=${version_number}
        )`;
    } else {
        query = `SELECT * FROM vocabulary_metrics`;
    }
    client.query(query, (err, res1) => {
        if (err) {
            console.error(err);
            return;
        }
        res.json({ vocabularies: res1.rows })
    });
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))