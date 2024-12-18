import { readFile } from "fs/promises";
import { resolve } from "path";

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  const response: ApiResponse = {
    success: false,
    data: {},
  };

  // Get the route path from the event
  const routePath = event.node.req.url || "";
  console.log(`${routePath} - Processing request`);

  // Get the query parameters from the request URL
  const query = getQuery(event);

  try {
    if (query.q == "columns") {
      const columnsFilePath = resolve(
        "assets/demo/services/services_columns.json"
      );
      const columns = JSON.parse(await readFile(columnsFilePath, "utf-8"));
      response.data.columns = columns;
      response.success = true;
    } else if (query.q == "services") {
      // Resolve the path to the services JSON file
      const servicesFilePath = resolve("assets/demo/services/services.json");
      // Read and parse the services data
      const services: Service[] = JSON.parse(
        await readFile(servicesFilePath, "utf-8")
      );
      response.data.services = services;
      response.success = true;
    } else {
      response.success = false;
      response.message = "Please check the url";
    }

    // Return the  response
    return response;
  } catch (error) {
    response.success = false;
    response.message = `Failed to retrieve data`;

    console.error("Error reading services/columns data:", error);
    return response;
  }
});
