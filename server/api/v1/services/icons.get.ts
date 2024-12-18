import { readFile } from "fs/promises";
import { resolve } from "path";

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    // Get the route path from the event
    const routePath = event.node.req.url || "";

    // Log the formatted route path
    console.log(`${routePath} - Processing request`);
    // Resolve the path to the icons file
    const filePath = resolve("assets/demo/services/icons.json");

    // Read and parse the icons data
    const icons: string[] = JSON.parse(await readFile(filePath, "utf-8"));

    // Get the query parameter from the request
    const query = getQuery(event).query?.toString().toLowerCase() || "";
    // Check if query is provided
    // if (!query) {
    //   return { success: false, message: "Query parameter is required" };
    // }

    // Filter the icons based on the query
    const matchedIcons = icons
      .filter((icon) => icon.toLowerCase().includes(query))
      .slice(0, 10);

    // Return the matched icons
    return {
      success: true,
      data: matchedIcons,
    };
  } catch (error) {
    console.error("Error reading icons file:", error);
    return { success: false, message: "Failed to retrieve icons" };
  }
});
