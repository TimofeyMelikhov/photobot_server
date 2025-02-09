import { PrismaClient } from "@prisma/client";

import { convertBigIntToString } from "../utils/converter.js";

const prisma = new PrismaClient();

export const getDistributorByTelegramId = async (telegramId) => {
  try {
    const distributor = await prisma.distributor.findUnique({
      where: { tg_user_id: BigInt(telegramId) },
    });

    return convertBigIntToString(distributor);
  } catch (error) {
    console.log(error);
  }
};

export const addDistributor = async (telegramId, username) => {
  try {
    const distributor = await prisma.distributor.create({
      data: { tg_user_id: BigInt(telegramId), username },
    });

    return convertBigIntToString(distributor);
  } catch (error) {
    console.log(error);
  }
};

export const getDistributorClients = async (distributorId) => {
  try {
    const clients = await prisma.client.findMany({
      where: { referrer_id: Number(distributorId) },
    });

    return clients.map(convertBigIntToString);
  } catch (error) {
    console.log(error);
  }
};

export const createDistributorPhotographerLink = async (
  distributorId,
  photographerId,
  link
) => {
  try {
    const linkEntry = await prisma.distributorPhotographerLink.create({
      data: {
        distributor_id: Number(distributorId),
        photographer_id: Number(photographerId),
        link,
      },
    });

    return convertBigIntToString(linkEntry);
  } catch (error) {
    console.log(error);
  }
};

export const getReferralLink = async (distributorId, photographerId) => {
  try {
    const referralLink = await prisma.distributorPhotographerLink.findFirst({
      where: {
        distributor_id: Number(distributorId),
        photographer_id: Number(photographerId),
      },
    });

    return convertBigIntToString(referralLink);
  } catch (error) {
    console.log(error);
  }
};

export const deleteProfile = async (id) => {
  try {
    await prisma.distributorPhotographerLink.deleteMany({
      where: { distributor_id: Number(id) },
    });
    await prisma.distributor.delete({ where: { id: Number(id) } });
  } catch (error) {
    console.error("Error in DistributorService:", error.message);
    throw error;
  }
};
