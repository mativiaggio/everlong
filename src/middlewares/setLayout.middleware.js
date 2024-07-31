import EnterpriseController from "../controllers/enterprise.controller.js";

const enterpriseController = new EnterpriseController();

export async function setLayout(req, res, next) {
  if (req.path.startsWith("/admin")) {
    const raw_enterprise = await enterpriseController.getEnterpriseData();
    const enterprise = raw_enterprise[0].toJSON();

    res.locals.layout = "admin/main";
    res.locals.enterprise = enterprise;
  } else {
    const raw_enterprise = await enterpriseController.getEnterpriseData();
    const enterprise = raw_enterprise[0].toJSON();
    res.locals.layout = "client/main";
    res.locals.enterprise = enterprise;
  }
  next();
}
