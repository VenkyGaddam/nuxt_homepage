import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";

type Service = {
  id: string;
  service: string;
  description: string;
  address: string;
  reverse_proxy: string;
  active: boolean;
  icon: string;
};

export default defineEventHandler(async (event) => {
  try {
    // Parse incoming request body
    const body = await readBody(event);

    if (!body || !body.id) {
      return { success: false, message: "Invalid data" };
    }

    // File paths
    const filePath = resolve("assets/demo/services/services.json");

    // Read the existing data
    const servicesData: Service[] = JSON.parse(
      await readFile(filePath, "utf-8")
    );

    // Find the service by id
    const serviceIndex = servicesData.findIndex(
      (service) => service.id === body.id
    );

    if (serviceIndex === -1) {
      return { success: false, message: "Service not found", data: body };
    }

    // Update the service
    servicesData[serviceIndex] = { ...servicesData[serviceIndex], ...body };

    // Write the updated data back to the file
    await writeFile(filePath, JSON.stringify(servicesData, null, 2));

    return { success: true, message: "Service updated successfully" };
  } catch (error) {
    console.error("Error updating services file:", error);
    return { success: false, message: "Internal Server Error" };
  }
});
