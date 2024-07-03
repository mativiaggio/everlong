// import { Router } from "express";
// import mailerTransport from "../../../config/mailer.config.js";
// import { mailing } from "../../../config/env.js";
// import Handlebars from "handlebars";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import path from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const clientMailerRouter = Router();

// clientMailerRouter.post("/test-email/:email", async (req, res) => {
//   const destination = req.params.email || "";
//   try {
//     fs.readFile(
//       __dirname + "../../../../views/client/emails/test-email.html",
//       "utf8",
//       async (err, data) => {
//         if (err) {
//           console.error("Error leyendo el archivo HTML:", err);
//           return;
//         }
//         await mailerTransport.sendMail({
//           from: `Everlong <${mailing.auth.EMAIL_USER}>`,
//           to: destination,
//           subject: "Test email",
//           html: data,
//         });
//         res.status(200).json(data);
//       }
//     );
//   } catch (error) {
//     res.status(500).send({ status: "error", error: error.message });
//   }
// });

// export default clientMailerRouter;

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
          filename: "logo.png",
          path: path.join(__dirname, "../../../public/images/hand-metal.png"),
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
