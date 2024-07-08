import { Router } from "express";
import { logger } from "../../../utils/logger.js";
import { Preference } from "mercadopago";
// import client from "../../../config/mercadopago.config.js";

import { MercadoPagoConfig } from "mercadopago";
import { MP_ACCESS_TOKEN } from "../../../config/env.js";

const mpClient = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });

const clientPaymentsRouter = Router();

clientPaymentsRouter.post("/create_preference", async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.price),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: "https://everlong.vercel.app/",
        failure: "https://everlong.vercel.app/",
        pending: "https://everlong.vercel.app/",
      },
      auto_return: "approved",
    };

    const preference = new Preference(mpClient);
    const result = await preference.create({ body });

    res.json({
      id: result.id,
    });
  } catch (err) {
    logger.error("Error creating preference:", err);
    res.status(500).json({ error: `Internal Server Error: ${JSON.stringify(err)}` });
  }
});

export default clientPaymentsRouter;
