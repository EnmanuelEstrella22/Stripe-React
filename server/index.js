const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();

const app = express();

const stripe = new Stripe(process.env.STRIPE_KEY);

app.use(cors({ origin: ['http://localhost:3000'] }));
app.use(express.json());

app.post('/api/checkout', async (req, res) => {
  const { id, amount } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: 'USD',
      description: 'compra de casa',
      payment_method: id,
      confirm: true,
    });

    res.send({ mensaje: 'Pago realizado correctamente' });
  } catch (error) {
    switch (error.statusCode) {
      case 400:
        return res.json({ mensaje: 'Falta un parámetro obligatorio.' });
      case 401:
      case 403:
        return res.json({ mensaje: 'Credenciales inválidas' });
      case 402:
        return res.json({ mensaje: 'Numero de tarjeta incorrecto' });
      case 404:
      case 409:
      case 429:
        return res.json({ mensaje: 'Error Stripe' });
      default:
        return res.json({ mensaje: 'Error en el servidor' });
    }
  }
});

app.listen(3001, () => {
  console.log('Server on port ', 3001);
});
