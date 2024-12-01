import prisma from "./prisma";
import { hasKeyInJar, removeKeyFromJar, storeKeyInJar } from "./actions";
import { revalidatePath } from "next/cache";

export const getHolder = async (holderId: number) => {
  return await prisma.holder.findUnique({ where: { id: holderId } });
};

export const getOwner = async (id: number) => {
  return await prisma.owner.findUnique({
    where: { id },
    include: { keys: true },
  });
};

export const getKey = async (id: string) => {
  return await prisma.key.findUnique({ where: { id } });
};

export const createHolderWithExistingKey = async (
  name: string,
  keyId: string,
  callback: (success: boolean, message?: string) => void
) => {
  const hasKey = await hasKeyInJar();
  if (hasKey) {
    callback(false, "You already have a key in possesion.");
    return;
  }

  try {
    // Use a transaction to ensure consistency
    const [key, holder] = await prisma.$transaction([
      prisma.key.update({
        where: { id: keyId },
        data: { holderType: "HOLDER" },
      }),
      prisma.holder.create({
        data: {
          name,
          keys: {
            connect: [{ id: keyId }],
          },
        },
      }),
    ]);

    callback(true);
    storeKeyInJar(key.id);

    revalidatePath("/");
    return holder;
  } catch (error) {
    console.error("Error creating holder or updating key:", error);
    throw error;
  }
};

export const returnKey = async (
  keyId: string,
  callback: (success: boolean, message?: string) => void
) => {
  try {
    // First, get the holder associated with the key
    const key = await prisma.key.findUnique({
      where: { id: keyId },
      include: {
        holder: true, // Include the associated holder
      },
    });

    if (!key || !key.holder) {
      callback(false, "No holder found for this key.");
      return;
    }

    // Use a transaction to ensure the key and holder update are atomic
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [updatedKey, deletedHolder] = await prisma.$transaction([
      prisma.key.update({
        where: { id: keyId },
        data: {
          holderType: "OWNER", // Reset the holderType to "OWNER"
          holderId: null, // Remove the holder reference
        },
      }),
      prisma.holder.delete({
        where: { id: key.holder.id }, // Delete the holder from the system
      }),
    ]);

    // Optionally, add logic to store the key back in the owner's collection
    await removeKeyFromJar();
    callback(true, "Key has been successfully returned.");

    revalidatePath("/");
    return updatedKey; // Return the updated key
  } catch (error) {
    console.error("Error returning key:", error);
    callback(false, "An error occurred while processing your request.");
    throw error;
  }
};
