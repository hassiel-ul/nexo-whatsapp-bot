const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TOKEN = "EAALjX4ZCclA4BRvI9QApIwvjCa1BSkPx8aZAbqLJzcExoN3tsBMZC0k8iPhJ4PKoEpkNBZA9ahQVVqzDC0JwO2yG59sTLbUu6oy6iNx9o8qfAuyHozZBBUdrjjobcqgQRBGw2ZAh9TcZBZCMz7cla7h9gu81h53FE7HmDjSoxSLyZAsFSZBYdOoLDhkeYredfc02Uz91yZBKtM2cFwrvixXZC2eKMW1nInIBfDfxEP5okhEOMZBEllCelZBN0PI8CdYW5aRZB2CrHMqkV06U7DfpHBj54mspJPRAAZDZD";
const PHONE_NUMBER_ID = "1207792802408646";
const VERIFY_TOKEN = "nexo123";

const respuestas = {
  hola: "Hola 👋 Bienvenido a NEXO Studio. Creamos páginas web profesionales con asistentes automatizados.",
  precio: "Nuestros planes empiezan desde RD$5,000. El precio depende del tipo de página.",
  bot: "Sí, podemos agregar un bot a tu página web o WhatsApp para responder preguntas automáticamente.",
  tiempo: "Una página básica tarda de 2 a 4 días. Una página con bot tarda de 5 a 7 días.",
  contacto: "Puedes contactarnos al 849-565-4248."
};

app.get("/", (req, res) => {
  res.send("Bot NEXO Studio funcionando 🚀");
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!msg) return res.sendStatus(200);

    const numero = msg.from;
    const texto = msg.text?.body?.toLowerCase().trim();

    const respuesta =
      respuestas[texto] ||
      "Gracias por escribirnos. Puedes preguntar: hola, precio, bot, tiempo o contacto.";

    await axios.post(
      `https://graph.facebook.com/v25.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: numero,
        text: { body: respuesta }
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Mensaje respondido a:", numero);
    res.sendStatus(200);
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log("Servidor iniciado en puerto 3000");
});