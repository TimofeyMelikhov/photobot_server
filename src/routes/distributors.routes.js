import express from "express";
import {
  getDistributor,
  newDistributor,
  fetchDistributorClients,
  addDistributorPhotographerLink,
  fetchReferralLink,
  deleteDistributorProfile,
} from "../controllers/distributors.controller.js";
import { logger } from "../middleware/logger.js";

const router = express.Router();

router.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

router.post("/", newDistributor);
router.post("/link", addDistributorPhotographerLink);
router.delete("/delete", deleteDistributorProfile);
router.get("/:id/clients", fetchDistributorClients);
router.get("/link/:distributor_id/:photographer_id", fetchReferralLink);
router.get("/:telegramId", getDistributor);

export default router;
