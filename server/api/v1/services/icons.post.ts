import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";

// Define the type for the response
interface ApiResponse {
  success: boolean;
  message: string;
}

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    // Resolve the path to the icons file
    const filePath = resolve("assets/demo/services/icons.json");

    // Log the file path
    console.log("API - Adding new icon. File path:", filePath);

    // Read the existing icons from the file
    const icons: string[] = JSON.parse(await readFile(filePath, "utf-8"));

    // Parse the POST request body to get the new icon
    const body = await readBody(event);
    const newIcon = body?.icon;

    // Validate the new icon
    if (!newIcon || typeof newIcon !== "string") {
      return { success: false, message: "Invalid icon format" };
    }

    if (icons.includes(newIcon)) {
      return { success: false, message: "Icon already exists" };
    }

    // Add the new icon to the list
    icons.push(newIcon);

    // Write the updated icons list back to the file
    await writeFile(filePath, JSON.stringify(icons, null, 2), "utf-8");

    // Log success
    console.log("API - Icon added successfully:", newIcon);

    // Return success response
    return { success: true, message: "Icon added successfully" };
  } catch (error) {
    console.error("API - Error adding icon:", error);
    return { success: false, message: "Failed to add icon" };
  }
});
