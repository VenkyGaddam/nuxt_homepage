import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";

/**
 * Type for input entry from the request body.
 */
type InputEntry = {
  address: string;
  reverse_proxy: string;
  active: boolean;
};

export default defineEventHandler(async (event) => {
  try {
    // Parse incoming request body
    const body = await readBody(event);

    if (!body) {
      return { success: false, message: "Invalid data" };
    }

    // Split the input by line and parse each line into address, reverse_proxy, and active
    const inputEntries: InputEntry[] = body
      .trim()
      .split("\n")
      .map((line: string) => {
        const [address, reverse_proxy, active] = line
          .split("|")
          .map((item) => item.trim());
        return { address, reverse_proxy, active: active === "X" };
      });

    // File path for the services file
    const filePath = resolve("assets/demo/services/services.json");

    // Read the existing data from the file
    const servicesData: Service[] = JSON.parse(
      await readFile(filePath, "utf-8")
    );

    // Create a set of addresses from the input for easier lookup
    const inputAddresses = new Set(
      inputEntries.map((entry: InputEntry) => entry.address)
    );

    // Update or create services based on input
    inputEntries.forEach(({ address, reverse_proxy, active }: InputEntry) => {
      const serviceIndex = servicesData.findIndex(
        (service) => service.address === address
      );
      if (serviceIndex !== -1) {
        // Update existing service
        servicesData[serviceIndex] = {
          ...servicesData[serviceIndex],
          reverse_proxy,
          active,
        };
      } else {
        // Create new service if it does not exist
        servicesData.push({
          id: crypto.randomUUID(), // Generate a unique ID for new entries
          service: "", // Placeholder or empty field
          description: "", // Placeholder or empty field
          address,
          reverse_proxy,
          active,
          icon: "", // Placeholder or empty field
        });
      }
    });

    // Mark services as inactive if their address is not in the input
    servicesData.forEach((service) => {
      if (!inputAddresses.has(service.address)) {
        service.active = false;
      }
    });

    // Write the updated data back to the file
    await writeFile(filePath, JSON.stringify(servicesData, null, 2));

    return { success: true, message: "Services updated successfully" };
  } catch (error) {
    console.error("Error updating services file:", error);
    return { success: false, message: "Internal Server Error" };
  }
});
