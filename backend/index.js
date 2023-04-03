const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());

app.post('/api/auth/signin', (req, res) => {
    res.json({
        id: 'user_id',
        username: 'my_username_morski ',
        accessToken: '1234asdf5678qwer'
    });
});

app.post('/api/auth/signup', (req, res) => {
    res.json({
        id: 'user_id',
        username: 'my_username_morski ',
        accessToken: '1234asdf5678qwer'
    });
});

app.get('/api/event', (req, res) => {
    res.json({
        id: 'event_id',
        year: '2023',
        location: 'Liverpool',
        active: true
    });
});

app.get('/api/event/:year/:type', (req, res) => {
    res.json({
        id: 'event_id',
        year: '2023',
        location: 'Liverpool',
        active: true,
        shows: [
            {
                id: 'show_id',
                date: '2023-05-13',
                type: 1,
                name: "First Semi-Final",
                active: true,
                participants: [
                    {
                        country: 'Finland',
                        order: 15,
                        name: 'Kaarija',
                        song: 'Cha cha cha'
                    },
                    {
                        country: 'Sweden',
                        order: 14,
                        name: 'Loreen',
                        song: 'adasdasd'
                    },
                    {
                        country: 'Belgium',
                        order: 13,
                        name: 'Some name',
                        song: 'Some song'
                    },
                    {
                        country: 'United Kingdom',
                        order: 12,
                        name: 'UK Shit',
                        song: 'Grime'
                    },
                    {
                        country: 'Norway',
                        order: 15,
                        name: 'Kaarija',
                        song: 'Cha cha cha'
                    },
                    {
                        country: 'Denmark',
                        order: 14,
                        name: 'Loreen',
                        song: 'adasdasd'
                    },
                    {
                        country: 'Germany',
                        order: 13,
                        name: 'Some name',
                        song: 'Some song'
                    },
                    {
                        country: 'Ireland',
                        order: 12,
                        name: 'UK Shit',
                        song: 'Grime'
                    }
                ]
            }
        ]
    });
});

app.get('/api/test/user', (req, res) => {
    res.json({
        data: 'some data'
    });
});

app.get('/api/test/mod', (req, res) => {
    res.json({
        data: 'some data'
    });
});

app.get('/api/test/admin', (req, res) => {
    res.json({
        data: 'some data'
    });
});


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});