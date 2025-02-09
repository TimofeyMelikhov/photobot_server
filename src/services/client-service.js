import { PrismaClient } from "@prisma/client";
import { convertBigIntToString } from "../utils/converter.js";

const prisma = new PrismaClient();

export const findClientByTelegramId = async (telegramId) => {
  try {
    const client = await prisma.client.findUnique({
      where: { tg_user_id: BigInt(telegramId) },
    });
    return convertBigIntToString(client);
  } catch (error) {
    console.log(error);
  }
};

export const findClientByPhotographer = async (photographerId, telegramId) => {
  try {
    const client = await prisma.client.findFirst({
      where: {
        photographer_id: Number(photographerId),
        tg_user_id: BigInt(telegramId),
      },
    });
    return convertBigIntToString(client);
  } catch (error) {
    console.log(error);
  }
};

export const insertClient = async (
  photographerId,
  telegramId,
  username,
  distributorId,
  communicationMethod
) => {
  try {
    const client = await prisma.client.create({
      data: {
        photographer_id: Number(photographerId),
        tg_user_id: BigInt(telegramId),
        tg_username: username,
        referrer_id: distributorId ? Number(distributorId) : null,
        isConfirmed: null,
        communicationMethod,
      },
    });
    return convertBigIntToString(client);
  } catch (error) {
    console.log(error);
  }
};

export const updateClientCommunicationMethod = async (
  telegramId,
  communicationMethod
) => {
  try {
    const updatedClient = await prisma.client.update({
      where: { tg_user_id: BigInt(telegramId) },
      data: { communicationMethod },
    });
    return convertBigIntToString(updatedClient);
  } catch (error) {
    console.log(error);
  }
};

export const findPhotographerForClient = async (telegramId) => {
  try {
    const photographer = await prisma.photographer.findFirst({
      where: {
        clients: {
          some: {
            tg_user_id: BigInt(telegramId),
          },
        },
      },
    });
    return convertBigIntToString(photographer);
  } catch (error) {
    console.log("Error finding photographer for client:", error);
  }
};

export const confirmClientById = async (clientId, isConfirmed) => {
  try {
    const updatedClient = await prisma.client.update({
      where: { id: Number(clientId) },
      data: { isConfirmed: isConfirmed },
    });
    return convertBigIntToString(updatedClient);
  } catch (error) {
    console.log(error);
  }
};
