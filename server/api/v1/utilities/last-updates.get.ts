import { readFile } from "fs/promises";
import { resolve } from "path";

type LastUpdateEntry = {
  key: string;
  label: string;
  timestamp: string;
};

type LastUpdates = LastUpdateEntry[];

export default defineEventHandler(async (event) => {
  const lastUpdatesPath = resolve("assets/demo/services/last_updates.json");

  try {
    // Read the data from last_updates.json
    const lastUpdatesData: LastUpdates = JSON.parse(
      await readFile(lastUpdatesPath, "utf-8")
    );

    // Return the data as a response
    return { success: true, data: lastUpdatesData };
  } catch (error) {
    console.error("Error reading last_updates file:", error);
    return { success: false, message: "Failed to read last updates" };
  }
});
