
import axios from "axios";
export const createPreference = async (req, res) => {
  try {
    const { title, price } = req.body;

    const accessToken = "APP_USR-4079920505511811-061612-a6c0018417f373529b4212602f726fae-1049027016";

    const response = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      {
        items: [
          {
            title,
            quantity: 1,
            currency_id: "ARS",
            unit_price: Number(price),
          },
        ],
        back_urls: {
          success: "http://localhost:5173/success",
          failure: "http://localhost:5173/failure",
          pending: "http://localhost:5173/pending",
        },
        auto_return: "approved",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json({ init_point: response.data.init_point });
  } catch (err) {
    console.error("Error al generar preferencia MP:", err.response?.data || err);
    res.status(500).json({ message: "Error al generar preferencia de pago" });
  }
};

