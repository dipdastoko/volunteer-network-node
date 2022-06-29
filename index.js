const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zqquk.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const database = client.db('volunteer-network');
        const eventCollection = database.collection('events');
        const volunteerCollection = database.collection('volunteers');

        // Get API
        app.get('/events', async (req, res) => {
            const cursor = eventCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });

        app.get('/allvolunteers', async (req, res) => {
            const cursor = volunteerCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })

        // POST API
        app.post('/volunteer', async (req, res) => {
            const volunteer = req.body;
            const result = await volunteerCollection.insertOne(volunteer);
            res.json(result);
        });


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('volunteer network server running');
});

app.listen(port, () => {
    console.log('listening from server', port);
});