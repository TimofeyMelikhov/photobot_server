import {
  findClientByTelegramId,
  findClientByPhotographer,
  insertClient,
  updateClientCommunicationMethod,
  findPhotographerForClient,
  confirmClientById,
} from "../services/client-service.js";

export const getClient = async (req, res) => {
  const { telegramId } = req.params;
  try {
    const client = await findClientByTelegramId(telegramId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getExistingClient = async (req, res) => {
  const { photographerId, telegramId } = req.params;
  try {
    const client = await findClientByPhotographer(photographerId, telegramId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNewClient = async (req, res) => {
  const {
    photographerId,
    tg_user_id,
    username,
    distributorId,
    communicationMethod,
  } = req.body;
  try {
    const client = await insertClient(
      photographerId,
      tg_user_id,
      username,
      distributorId,
      communicationMethod
    );
    res.status(201).json({ message: "Client created successfully", client });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCommunicationMethod = async (req, res) => {
  const { telegramId } = req.params;
  const { communicationMethod } = req.body;
  try {
    await updateClientCommunicationMethod(telegramId, communicationMethod);
    res
      .status(200)
      .json({ message: "Communication method updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPhotographerByClient = async (req, res) => {
  const { telegramId } = req.params;
  try {
    const photographer = await findPhotographerForClient(telegramId);
    if (!photographer) {
      return res.status(404).json({ message: "Photographer not found" });
    }
    res.status(200).json(photographer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const confirmClient = async (req, res) => {
  const { clientId } = req.params;
  const { isConfirmed } = req.body;
  try {
    await confirmClientById(clientId, isConfirmed);
    res.status(200).json({ message: "Client confirmed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
