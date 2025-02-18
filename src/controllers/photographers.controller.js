import config from "config";
import axios from "axios";
import * as photographerService from "../services/photographer-service.js";

const BOT_TOKEN = config.get("TELEGRAM_TOKEN");

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

export const broadcastPhotographers = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const photographers = await photographerService.fetchAllPhotographers();
    const idArray = photographers.map((ph) => ph.tg_user_id);
    const sendWithDelay = async (ids, delayMs) => {
      for (let i = 0; i < ids.length; i++) {
        try {
          await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
              chat_id: ids[i],
              text: message,
              parse_mode: "Markdown",
            }
          );

          console.log(`✅ Сообщение отправлено пользователю ${ids[i]}`);

          // Ждём перед следующим запросом
          if (i < ids.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }
        } catch (error) {
          if (error.response) {
            const errData = error.response.data;

            // 📌 Обрабатываем ошибки Telegram API
            if (errData.error_code === 403) {
              console.warn(`🚨 Бот заблокирован у пользователя ${ids[i]}!`);
            } else if (errData.error_code === 400) {
              console.warn(
                `❌ Ошибка "chat not found" у ${ids[i]}. Возможно, аккаунт удалён.`
              );
            } else if (errData.error_code === 429) {
              console.warn(
                `⏳ Превышен лимит запросов! Telegram просит подождать.`
              );
              await new Promise((resolve) =>
                setTimeout(resolve, errData.parameters.retry_after * 1000)
              );
              i--; // Повторяем отправку для этого же ID
            } else {
              console.error(`⚠️ Ошибка у ${ids[i]}:`, errData);
            }
          } else {
            console.error(`⚠️ Ошибка сети у ${ids[i]}:`, error.message);
          }
        }
      }
    };
    sendWithDelay(idArray, 35); // 35 мс = 1000 мс / 30 сообщений

    res.status(201).json({ message: "Broadcast started successfully" });
  } catch (error) {
    console.log(error);
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
