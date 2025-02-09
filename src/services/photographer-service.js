import { PrismaClient } from "@prisma/client";
import { convertBigIntToString } from "../utils/converter.js";

const prisma = new PrismaClient();

export const fetchAllPhotographers = async () => {
  try {
    const photographers = await prisma.photographer.findMany();
    return photographers.map(convertBigIntToString);
  } catch (error) {
    console.log(error);
  }
};

export const fetchPhotographerByField = async (field, value) => {
  try {
    const validFields = ["tg_user_id", "id"];
    if (!validFields.includes(field)) {
      throw new Error("Invalid field");
    }

    const filter = {};
    filter[field] = Number(value);

    const photographer = await prisma.photographer.findUnique({
      where: filter,
    });
    return convertBigIntToString(photographer);
  } catch (error) {
    console.log(error);
  }
};

export const addPhotographer = async (data) => {
  try {
    const numericData = {
      ...data,
      tg_user_id: BigInt(data.tg_user_id),
    };

    const photographer = await prisma.photographer.create({
      data: numericData,
    });
    return convertBigIntToString(photographer);
  } catch (error) {
    console.log(error);
  }
};

export const fetchClientsByPhotographerId = async (photographerId) => {
  try {
    const clients = await prisma.client.findMany({
      where: { photographer_id: Number(photographerId) },
    });
    return clients.map(convertBigIntToString);
  } catch (error) {
    console.log(error);
  }
};

export const fetchReferralsAndClients = async (photographerId) => {
  try {
    const referrals = await prisma.distributorPhotographerLink.findMany({
      where: { photographer_id: Number(photographerId) },
      include: { distributor: true },
    });

    const referralsWithClients = await Promise.all(
      referrals.map(async (referral) => {
        const clients = await prisma.client.findMany({
          where: { referrer_id: referral.distributor.id },
        });

        return {
          distributorId: referral.distributor.id,
          username: referral.distributor.username,
          clients: clients.map(convertBigIntToString),
        };
      })
    );

    return referralsWithClients;
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при получении данных");
  }
};

export const addReferral = async ({ photographerId, distributorId }) => {
  try {
    const referral = await prisma.referral.create({
      data: {
        photographer: { connect: { id: Number(photographerId) } },
        referrer: { connect: { id: Number(distributorId) } },
      },
    });
    return convertBigIntToString(referral);
  } catch (error) {
    console.error("Error creating referral:", error.message);
    throw error;
  }
};

export const deleteProfile = async (id) => {
  try {
    await prisma.client.deleteMany({ where: { photographer_id: Number(id) } });
    await prisma.referral.deleteMany({
      where: { photographer_id: Number(id) },
    });
    await prisma.distributorPhotographerLink.deleteMany({
      where: { photographer_id: Number(id) },
    });
    await prisma.photographer.delete({ where: { id: Number(id) } });
  } catch (error) {
    console.error("Error in PhotographerService:", error.message);
    throw error;
  }
};

export const fetchUserByTgId = async (userType, tgUserId) => {
  try {
    const tableName =
      userType === "photographer" ? "photographer" : "distributor";
    const user = await prisma[tableName].findUnique({
      where: { tg_user_id: BigInt(tgUserId) },
    });
    return convertBigIntToString(user);
  } catch (error) {
    console.log(error);
  }
};
