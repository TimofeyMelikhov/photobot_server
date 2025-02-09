import express from "express";
import {
  getAllPhotographers,
  getPhotographer,
  createPhotographerProfile,
  getPhotographerClients,
  getReferralsAndClients,
  createNewReferral,
  deletePhotographerProfile,
  checkUserByTgId,
} from "../controllers/photographers.controller.js";
import { logger } from "../middleware/logger.js";

const router = express.Router();

router.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

router.get("/", getAllPhotographers);
router.post("/create", createPhotographerProfile);
router.post("/referral", createNewReferral);
router.get("/check-user", checkUserByTgId);
router.delete("/delete", deletePhotographerProfile);
router.get("/:id/clients", getPhotographerClients);
+router.get("/:id/referrals", getReferralsAndClients);
router.get("/:field/:id", getPhotographer);

export default router;
