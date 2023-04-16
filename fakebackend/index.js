const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { type } = require('os');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());

app.post('/fake/auth/signin', (req, res) => {
    res.json({
        id: 'user_id',
        username: 'my_username_morski ',
        accessToken: '1234asdf5678qwer'
    });
});

app.post('/fake/auth/signup', (req, res) => {
    res.json({
        id: 'user_id',
        username: 'my_username_morski ',
        accessToken: '1234asdf5678qwer'
    });
});

app.get('/fake/event', (req, res) => {
    res.json({
        id: 'event_id',
        year: '2023',
        location: 'Liverpool',
        active: true,
        participants: [
            { name: "Alessandra", song: "Queen of Kings", order: 1, country: "Norway" },
            { name: "The Busker", song: "Dance (Our Own Party)", order: 2, country: "Malta" },
            { name: "Luke Black", song: "Samo mi se spava", order: 3, country: "Serbia" },
            { name: "Sudden Lights", song: "Aija", order: 4, country: "Latvia" },
            { name: "Mimicat", song: "Ai coração", order: 5, country: "Portugal" },
            { name: "Wild Youth", song: "We Are One", order: 6, country: "Ireland" },
            { name: "Let 3", song: "Mama ŠC!", order: 7, country: "Croatia" },
            { name: "Remo Forrer", song: "Watergun", order: 8, country: "Switzerland" },
            { name: "Noa Kirel", song: "Unicorn", order: 9, country: "Israel" },
            { name: "Pasha Parfeni", song: "Soarele ?i luna", order: 10, country: "Moldova" },
            { name: "Loreen", song: "Tattoo", order: 11, country: "Sweden" },
            { name: "TuralTuranX", song: "Tell Me More", order: 12, country: "Azerbaijan" },
            { name: "Vesna", song: "My Sisters Crown", order: 13, country: "Czech Republic" },
            { name: "Mia Nicolai and Dion Cooper", song: "Burning Daylight", order: 14, country: "Netherlands" },
            { name: "Käärijä", song: "Cha Cha Cha", order: 15, country: "Finland" },
        ]
    });
});

app.get('/fake/event/:year/:type', (req, res) => {
    if (req.params.type == 1) {
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
                        { name: "Alessandra", song: "Queen of Kings", order: 1, country: "Norway" },
                        { name: "The Busker", song: "Dance (Our Own Party)", order: 2, country: "Malta" },
                        { name: "Luke Black", song: "Samo mi se spava", order: 3, country: "Serbia" },
                        { name: "Sudden Lights", song: "Aija", order: 4, country: "Latvia" },
                        { name: "Mimicat", song: "Ai coração", order: 5, country: "Portugal" },
                        { name: "Wild Youth", song: "We Are One", order: 6, country: "Ireland" },
                        { name: "Let 3", song: "Mama ŠC!", order: 7, country: "Croatia" },
                        { name: "Remo Forrer", song: "Watergun", order: 8, country: "Switzerland" },
                        { name: "Noa Kirel", song: "Unicorn", order: 9, country: "Israel" },
                        { name: "Pasha Parfeni", song: "Soarele ?i luna", order: 10, country: "Moldova" },
                        { name: "Loreen", song: "Tattoo", order: 11, country: "Sweden" },
                        { name: "TuralTuranX", song: "Tell Me More", order: 12, country: "Azerbaijan" },
                        { name: "Vesna", song: "My Sisters Crown", order: 13, country: "Czech Republic" },
                        { name: "Mia Nicolai and Dion Cooper", song: "Burning Daylight", order: 14, country: "Netherlands" },
                        { name: "Käärijä", song: "Cha Cha Cha", order: 15, country: "Finland" },
                    ]
                }
            ]
        });
    }

    else if (req.params.type == 2) {
        res.json({
            id: 'event_id',
            year: '2023',
            location: 'Liverpool',
            active: true,
            shows: [
                {
                    id: 'show_id',
                    date: '2023-05-13',
                    type: 2,
                    name: "Second Semi-Final",
                    active: true,
                    participants: [
                        { name: "Reiley", song: "Breaking My Heart", order: 1, country: "Denmark" },
                        { name: "Brunette", song: "Future Lover", order: 2, country: "Armenia" },
                        { name: "Theodor Andrei", song: "D.G.T. (Off and On)", order: 3, country: "Romania" },
                        { name: "Alika", song: "Bridges", order: 4, country: "Estonia" },
                        { name: "Gustaph", song: "Because of You", order: 5, country: "Belgium" },
                        { name: "Andrew Lambrou", song: "Break a Broken Heart", order: 6, country: "Cyprus" },
                        { name: "Diljá", song: "Power", order: 7, country: "Iceland" },
                        { name: "Victor Vernicos", song: "What They Say", order: 8, country: "Greece" },
                        { name: "Blanka", song: "Solo", order: 9, country: "Poland" },
                        { name: "Joker Out", song: "Carpe Diem", order: 10, country: "Slovenia" },
                        { name: "Iru", song: "Echo", order: 11, country: "Georgia" },
                        { name: "Piqued Jacks", song: "Like an Animal", order: 12, country: "San Marino" },
                        { name: "Teya and Salena", song: "Who the Hell Is Edgar?", order: 13, country: "Austria" },
                        { name: "Albina & Familja Kelmendi", song: "Duje", order: 14, country: "Albania" },
                        { name: "Monika Linkyte", song: "Stay", order: 15, country: "Lithuania" },
                        { name: "Voyager", song: "Promise", order: 16, country: "Australia" },
                    ]
                }
            ]
        });
    }
    else {
        res.json({
            id: 'event_id',
            year: '2023',
            location: 'Liverpool',
            active: true,
            shows: [
                {
                    id: 'show_id',
                    date: '2023-05-13',
                    type: 3,
                    name: "Grand Final",
                    active: true,
                    participants: [
                        { name: "Tvorchi", song: "Heart of Steel", order: 19, country: "Ukraine" },
                        { name: "Mae Muller", song: "I Wrote a Song", order: 26, country: "United Kingdom" },
                    ]
                }
            ]
        });
    }

});

app.get('/fake/test/user', (req, res) => {
    res.json({
        data: 'some data'
    });
});

app.get('/fake/test/mod', (req, res) => {
    res.json({
        data: 'some data'
    });
});

app.get('/fake/test/admin', (req, res) => {
    res.json({
        data: 'some data'
    });
});


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});