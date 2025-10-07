import { COLLECTION_NAME, DB_NAME } from "@/app/constants";
import { Quest } from "@/app/schemas";
import client from "./mongo-client";

export async function createTextIndex() {
  try {
    const db = client.db(DB_NAME);
    const collection = db.collection<Quest>(COLLECTION_NAME);

    await collection.createIndex({
      name: "text",
      category: "text",
      description: "text",
    });

    console.log("Text index created successfully");
  } catch (error) {
    console.error("Error creating index", error);
  }
}
