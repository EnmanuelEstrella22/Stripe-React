import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import axios from 'axios';

import 'bootswatch/dist/lux/bootstrap.min.css';

const stripePromise = loadStripe(
  'pk_test_51IGP0aEoYIfDWk6bB4oKD5YH4psWNeWlAMsPjSzRzvGAZgDWtIkln499aa02jSzjVPd6a99RJSnsDr8v6Pw0MCzQ00Y8njo69C'
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const element = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: element.getElement(CardElement),
    });

    setLoading(true);

    if (!error) {
      const { id } = paymentMethod;

      // El monto(amount) siempre enviarlo en sentabos.
      const { data } = await axios.post('http://localhost:3001/api/checkout', {
        id,
        amount: 10000,
      });

      setLoading(false);
      // element.getElement(CardElement).clear();
      console.log(data.mensaje);
 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body">
      <img
        src="https://www.corsair.com/medias/sys_master/images/images/hb8/h35/8840689352734/-CH-9115020-ES-Gallery-K63-001.png"
        alt="teclado"
        className="img-fluit"
      />
      <h3 className="text-center my-2">Precio: 100$</h3>

      <div className="form-group">
        <CardElement className="form-control" />
      </div>
      <button className="btn btn-success" disabled={!stripe}>
        {loading ? (
          <div className="spinner-border text-light" rol="status"></div>
        ) : 'Compar'}
      </button>
    </form>
  );
};

const App = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default App;
