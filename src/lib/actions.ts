"use server";

import { cookies } from "next/headers";
import { createHolderWithExistingKey, returnKey } from "./db";
import { redirect } from "next/navigation";

export const createHolder = async (
  data: FormData
): Promise<{ success: boolean; message: string }> => {
  const name = data.get("name")?.toString();
  const keyId = data.get("keyId")?.toString();

  if (!name || !keyId) {
    return { success: false, message: "There was no name provided." };
  }

  await createHolderWithExistingKey(name, keyId, (success, message) => {
    return { success: success, message: success ? "" : message ?? "" };
  });

  return { success: false, message: "Something went wrong." };
};

export async function storeKeyInJar(keyId: string) {
  const jar = await cookies();
  jar.set("key", keyId);
}

export async function hasKeyInJar() {
  const jar = await cookies();
  const key = jar.get("key");

  if (key) return key;

  return false;
}

export async function removeKeyFromJar() {
  const jar = await cookies();
  jar.delete("key");
}

export const returnKeyAction = async (data: FormData) => {
  const keyId = data.get("key-id")?.toString();

  if (!keyId) {
    return;
  }

  await returnKey(keyId, () => {
    redirect("/finished-returning");
  });
};
