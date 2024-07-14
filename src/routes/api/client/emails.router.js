import { Router } from "express";
import mailerTransport from "../../../config/mailer.config.js";
import { HOST, mailing } from "../../../config/env.js";
import Handlebars from "handlebars";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientMailerRouter = Router();

clientMailerRouter.post("/test-email/:email", async (req, res) => {
  const destination = req.params.email || "";
  try {
    const filePath = path.join(
      __dirname,
      "../../../views/client/emails/test-email.handlebars"
    );
    const templateSource = await readFile(filePath, "utf8");

    const template = Handlebars.compile(templateSource);

    const data = { email: destination, full_name: "Matías Viaggio" };

    const html = template(data);

    await mailerTransport.sendMail({
      from: `Everlong <${mailing.auth.EMAIL_USER}>`,
      to: destination,
      subject: "Test email",
      html: html,
      attachments: [
        {
          filename: "email-body-logo.png",
          path: path.join(
            __dirname,
            "../../../public/images/email-body-logo.png"
          ),
          cid: "logo",
        },
      ],
    });
    res.status(200).json(html);
  } catch (err) {
    console.error("Error leyendo el archivo HTML:", err);
    res.status(500).json({ error: "Error al enviar el correo electrónico" });
  }
});

clientMailerRouter.post("/register/:email", async (req, res) => {
  const destination = req.body.data.user.email || "";
  const data = req.body.data.user || "";
  // console.log("data de email: " + JSON.stringify(req.body.data));

  try {
    const filePath = path.join(
      __dirname,
      "../../../views/client/emails/register.handlebars"
    );
    const templateSource = await readFile(filePath, "utf8");
    const template = Handlebars.compile(templateSource);
    const html = template(data);
    await mailerTransport.sendMail({
      from: `Everlong <${mailing.auth.EMAIL_USER}>`,
      to: destination,
      subject: "Solicitud de registro procesada con éxito",
      html: html,
      attachments: [
        {
          filename: "email-body-logo.png",
          path: path.join(
            __dirname,
            "../../../public/images/email-body-logo.png"
          ),
          cid: "logo",
        },
      ],
    });
    res.status(200).json(html);
  } catch (err) {
    console.error("Error leyendo el archivo HTML:", err);
    res.status(500).json({ error: "Error al enviar el correo electrónico" });
  }
});

clientMailerRouter.post("/account/request-reset", async (req, res) => {
  let data = req.body.data || {};
  const destination = data.user.email || "";
  const resetUrl = `${HOST}/recuperar-cuenta/${data.token}`;

  data = {
    ...data,
    resetUrl,
  };

  console.log("data de email: " + JSON.stringify(data));

  if (!destination) {
    console.error("No recipients defined");
    return res.status(400).json({ error: "Email recipient not defined" });
  }

  try {
    const filePath = path.join(
      __dirname,
      "../../../views/client/emails/request-reset.handlebars"
    );
    const templateSource = await readFile(filePath, "utf8");
    const template = Handlebars.compile(templateSource);
    const html = template(data);

    await mailerTransport.sendMail({
      from: `Everlong <${mailing.auth.EMAIL_USER}>`,
      to: destination,
      subject: "Solicitud de cambio de contraseña",
      html: html,
      attachments: [
        {
          filename: "email-body-logo.png",
          path: path.join(
            __dirname,
            "../../../public/images/email-body-logo.png"
          ),
          cid: "logo",
        },
      ],
    });

    res.status(200).json(html);
  } catch (err) {
    console.error("Error leyendo el archivo HTML:", err);
    res.status(500).json({ error: "Error al enviar el correo electrónico" });
  }
});

export default clientMailerRouter;
