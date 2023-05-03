import express from "express";
import chatBotController from "../controllers/chatBotController.js";

let router = express.Router();

let initWebRoutes = (app) => {
  // get homepage
  router.get("/", chatBotController.getHomePage);

  // set up get started
  router.post("/setup-profile", chatBotController.setUpProfile);

  // set up persistent menu
  router.post("/setup-persistent", chatBotController.setUpPersistentMenu);

  // set up webhook
  router.get("/webhook", chatBotController.getWebhook);
  router.post("/webhook", chatBotController.postWebhook);

  return app.use("/", router);
};

export default initWebRoutes;
