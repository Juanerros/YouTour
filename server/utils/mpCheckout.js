// /services/mercadoPago/createMercadoPagoCheckout.js

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export async function createCheckout(title, price) {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
 
  if (!accessToken) {
    throw new Error('Access token de Mercado Pago no definido.');
  }

  const validPrice = Number(price);
  if (isNaN(validPrice) || validPrice <= 0) {
    throw new Error('El precio debe ser un número válido mayor a 0.');
  }

  const body = {
    items: [
      {
        title: title,
        quantity: 1,
        currency_id: 'ARS',
        unit_price: validPrice,
      },
    ],
    back_urls: {
      success: "https://www.tusitio.com/success",
      failure: "https://www.tusitio.com/failure",
      pending: "https://www.tusitio.com/pending",
    },
    auto_return: "approved",
  };

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`MercadoPago Error: ${data.message}`);
    }

    return data; 
  } catch (error) {
    console.error('Error creando checkout en MercadoPago:', error);
    throw error;
  }
}
