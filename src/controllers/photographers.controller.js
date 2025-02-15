import * as photographerService from "../services/photographer-service.js";

export const getAllPhotographers = async (req, res) => {
  try {
    const photographers = await photographerService.fetchAllPhotographers();
    if (!photographers.length) {
      return res.status(404).json({
        status: 404,
        data: {
          errors: [
            {
              type: "NotFound",
              value: "photographers",
              msg: "No photographers found",
              location: "server",
            },
          ],
        },
      });
    }
    res.json(photographers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPhotographer = async (req, res) => {
  const { field, id } = req.params;

  try {
    const photographer = await photographerService.fetchPhotographerByField(
      field,
      id
    );
    if (!photographer) {
      return res.status(404).json({ error: "Photographer not found" });
    }

    res.status(200).json(photographer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPhotographerProfile = async (req, res) => {
  try {
    const photographer = await photographerService.addPhotographer(req.body);

    res
      .status(201)
      .json({ message: "Photographer created successfully", photographer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPhotographerClients = async (req, res) => {
  try {
    const clients = await photographerService.fetchClientsByPhotographerId(
      req.params.id
    );
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReferralsAndClients = async (req, res) => {
  try {
    const data = await photographerService.fetchReferralsAndClients(
      req.params.id
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNewReferral = async (req, res) => {
  try {
    await photographerService.addReferral(req.body);
    res.status(201).json({ message: "Referral created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePhotographerProfile = async (req, res) => {
  const { id } = req.params;

  try {
    await photographerService.deleteProfile(id);
    res
      .status(200)
      .json({ message: "Photographer profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting photographer profile:", error.message);
    res.status(500).json({ error: "Failed to delete photographer profile" });
  }
};

export const checkUserByTgId = async (req, res) => {
  const { tgUserId, userType } = req.query;
  try {
    const user = await photographerService.fetchUserByTgId(
      userType,
      Number(tgUserId)
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
