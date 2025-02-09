import express from "express";
import {
  getClient,
  getExistingClient,
  createNewClient,
  updateCommunicationMethod,
  getPhotographerByClient,
  confirmClient,
} from "../controllers/clients.controller.js";
import { logger } from "../middleware/logger.js";

const router = express.Router();

router.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

router.post("/", createNewClient);
router.patch("/:clientId/confirm", confirmClient);
router.patch("/:telegramId/communication", updateCommunicationMethod);
router.get("/:telegramId/photographer", getPhotographerByClient);
router.get("/:telegramId", getClient);
router.get("/:photographerId/:telegramId", getExistingClient);

export default router;
