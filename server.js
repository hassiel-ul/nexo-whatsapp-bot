const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TOKEN = process.env.TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

const respuestas = {
  hola: "¡Hola! 👋 Bienvenido a NEXO Studio. Creamos páginas web profesionales, sistemas web y asistentes automatizados para negocios. Puedes escribir: servicios, precios, cotizar, tiempo, bot o contacto.",

  servicios: "En NEXO Studio ofrecemos diseño web profesional, tiendas online, sistemas personalizados, integración con WhatsApp, asistentes automatizados, SEO básico, hosting, dominio y mantenimiento web.",

  "quienes son": "Somos NEXO Studio, un estudio digital enfocado en ayudar a negocios y emprendedores a tener presencia profesional en Internet con páginas modernas, rápidas y adaptadas a celulares.",

  "que hacen": "Creamos páginas web, tiendas online, sistemas para negocios, landing pages, portafolios, bots para atención al cliente e integraciones con WhatsApp.",

  precio: "Nuestros precios dependen del tipo de proyecto. Una página básica empieza desde RD$5,000. Para darte un precio exacto, escribe: cotizar.",

  precios: "Manejamos planes según la necesidad del cliente: página básica, página profesional, tienda online, sistema personalizado y página con asistente automatizado. Escribe 'cotizar' para recibir una orientación personalizada.",

  cotizar: "¡Claro! Para cotizar tu página necesito estos datos:\n\n1️⃣ Nombre del negocio\n2️⃣ Tipo de negocio\n3️⃣ Servicios o productos que ofreces\n4️⃣ Secciones que deseas: Inicio, Servicios, Galería, Contacto, etc.\n5️⃣ ¿Tienes logo e imágenes?\n6️⃣ ¿Quieres WhatsApp integrado?\n7️⃣ ¿Quieres asistente automatizado?\n8️⃣ ¿Tienes dominio?\n9️⃣ Presupuesto aproximado\n\nEnvíame esa información y te preparamos una cotización.",

  "quiero cotizar": "Perfecto. Para cotizar necesito saber: nombre del negocio, tipo de página, funciones que deseas, si tienes logo, si tienes imágenes, si necesitas WhatsApp, si quieres bot y si ya tienes dominio.",

  "quiero una pagina": "¡Excelente decisión! Para empezar necesito saber qué tipo de página deseas: informativa, tienda online, página de servicios, sistema de citas, catálogo o página con asistente automatizado.",

  "quiero una pagina web": "Perfecto. Para ayudarte mejor dime: ¿qué tipo de negocio tienes, qué funciones necesitas y si ya tienes logo, imágenes y dominio?",

  "que necesito": "Para crear tu página necesitamos: nombre del negocio, logo, colores preferidos, descripción de servicios, fotos, número de contacto, redes sociales y cualquier idea o referencia que te guste.",

  tiempo: "Una página básica puede estar lista entre 2 y 4 días. Una página profesional o con bot puede tardar entre 5 y 7 días. Un sistema personalizado puede tardar más según las funciones.",

  bot: "Sí, podemos crear asistentes automatizados para páginas web o WhatsApp. Estos pueden responder preguntas frecuentes, brindar información, guiar al cliente y captar datos para cotizaciones.",

  whatsapp: "Podemos conectar WhatsApp a tu página para que los clientes te escriban directamente. También podemos crear botones, formularios y asistentes automatizados.",

  tienda: "Sí, hacemos tiendas online con catálogo de productos, carrito, contacto por WhatsApp y diseño adaptable a celulares.",

  restaurante: "Sí, hacemos páginas para restaurantes con menú digital, ubicación, reservas, galería de platos y contacto por WhatsApp.",

  veterinaria: "Sí, hacemos páginas para veterinarias con servicios, citas, contacto, galería y sistemas personalizados si el cliente lo necesita.",

  rentcar: "Sí, hacemos páginas para rent car con catálogo de vehículos, reservas, precios, galería y botón de WhatsApp.",

  gimnasio: "Sí, hacemos páginas para gimnasios con planes, horarios, entrenadores, galería y contacto directo.",

  floristeria: "Sí, hacemos páginas para floristerías con catálogo de arreglos, fotos, precios y pedidos por WhatsApp.",

  seo: "Sí. Optimizamos la página con estructura básica SEO para que tu negocio tenga más posibilidades de aparecer en Google.",

  dominio: "Si no tienes dominio, te orientamos para comprar uno profesional. También podemos ayudarte a conectarlo con tu página.",

  hosting: "Sí. Te ayudamos a publicar tu página en Internet usando servicios confiables como Netlify, Render u otras plataformas según el proyecto.",

  mantenimiento: "Ofrecemos mantenimiento para actualizar textos, imágenes, precios, servicios y mantener la página funcionando correctamente.",

  soporte: "Sí. Después de entregar el proyecto podemos darte soporte para cambios, ajustes o mejoras.",

  pagos: "Sí, podemos integrar métodos de pago dependiendo del tipo de proyecto y las necesidades del negocio.",

  contacto: "Puedes contactarnos al 📞 849-565-4248. Será un placer ayudarte con tu proyecto.",

  horario: "Nuestro horario de atención es de lunes a sábado, de 8:00 AM a 8:00 PM.",

  gracias: "¡Gracias por contactar a NEXO Studio! Estamos listos para ayudarte a llevar tu negocio al siguiente nivel digital."
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
  "Gracias por escribir a NEXO Studio. Puedes preguntar por: servicios, precios, cotizar, tiempo, bot, WhatsApp, tienda online, dominio, soporte o contacto.";
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
