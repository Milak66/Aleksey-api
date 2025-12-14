const express = require('express');
const cors = require('cors');
require('dotenv').config();

console.log(process.env);

const app = express();
const PORT = 5696;

app.use(cors({
    origin: [
      'https://aleksey-the-developer.vercel.app',
      'https://thanos-the-developer.vercel.app'
    ],
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

    const telegramToken = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const message = `Пользователь написал: ${userData}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: message }),
        });
    
        if (!response.ok) {
          throw new Error(`Telegram API responded with status ${response.status}`);
        }
    
        res.json({ message: 'Сообщение успешно отправлено в Telegram' });
      } catch (error) {
        console.error('Ошибка при отправке в Telegram:', error);
        res.status(500).json({ message: 'Ошибка при отправке в Telegram' });
      }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});