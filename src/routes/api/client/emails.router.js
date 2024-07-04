import { Router } from "express";
import mailerTransport from "../../../config/mailer.config.js";
import { mailing } from "../../../config/env.js";
import Handlebars from "handlebars";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientMailerRouter = Router();

clientMailerRouter.post("/test-email/:email", async (req, res) => {
  const destination = req.params.email || "";
  const { nombre } = req.body; // Asegúrate de que 'nombre' se envíe en el cuerpo de la solicitud

  try {
    const filePath = path.join(__dirname, "../../../views/client/emails/test-email.handlebars");
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
          path: path.join(__dirname, "../../../public/images/email-body-logo.png"),
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
  const destination = req.params.email || "";
  try {
    const filePath = path.join(__dirname, "../../../views/client/emails/register.handlebars");
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
          path: path.join(__dirname, "../../../public/images/email-body-logo.png"),
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
