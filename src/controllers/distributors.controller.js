import {
  addDistributor,
  createDistributorPhotographerLink,
  deleteProfile,
  getDistributorByTelegramId,
  getDistributorClients,
  getReferralLink,
} from "../services/distributor-service.js";

export const getDistributor = async (req, res) => {
  const { telegramId } = req.params;
  try {
    const distributor = await getDistributorByTelegramId(telegramId);
    if (!distributor) {
      return res.status(404).json({ message: "No distributor found" });
    }
    res.status(200).json(distributor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const newDistributor = async (req, res) => {
  const { telegramId, username } = req.body;

  try {
    const distributor = await addDistributor(telegramId, username);
    if (!distributor) {
      return res.status(400).json({ message: "Error creating distributor" });
    }
    res.status(201).json(distributor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchDistributorClients = async (req, res) => {
  const { id } = req.params;
  try {
    const clients = await getDistributorClients(id);
    if (!clients || clients.length === 0) {
      return res.status(404).json({ message: "No clients found" });
    }
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addDistributorPhotographerLink = async (req, res) => {
  const { distributor_id, photographer_id, link } = req.body;

  try {
    await createDistributorPhotographerLink(
      distributor_id,
      photographer_id,
      link
    );
    res.status(201).json({ message: "Link created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchReferralLink = async (req, res) => {
  const { distributor_id, photographer_id } = req.params;
  try {
    const referralLink = await getReferralLink(distributor_id, photographer_id);
    res.status(200).json(referralLink);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDistributorProfile = async (req, res) => {
  const { id } = req.body;

  try {
    await deleteProfile(id);
    res
      .status(200)
      .json({ message: "Distributor profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting distributor profile:", error.message);
    res.status(500).json({ error: "Failed to delete distributor profile" });
  }
};
