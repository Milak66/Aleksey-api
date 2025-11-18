const express = require('express');
const cors = require('cors');
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log(process.env);

const app = express();
const PORT = 5696;

app.use(cors({
    origin: 'https://aleksey-the-developer.vercel.app',
    credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Server started");
});

app.route('/getData')
.get((req, res) => {
    res.send("Getting data");
})
.post(async (req, res) => {
    const { userData } = req.body;
    console.log('Received userData:', userData);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: `"Заказчик" <${process.env.EMAIL}>`,
        to: process.env.EMAIL,
        subject: 'Новое сообщение от пользователя',
        text: `Пользователь написал: ${userData}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Данные успешно отправлены и письмо отправлено' });
    } catch (error) {
        console.error('Ошибка при отправке письма:', error);
        res.status(500).json({ message: 'Ошибка при отправке почты', error: error.toString() });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});