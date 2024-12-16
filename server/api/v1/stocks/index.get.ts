import { readFile } from "fs/promises";
import { resolve } from "path";

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  const res: ApiResponse = { success: false, data: {} };

  // Extract 'year' query parameter
  const query = getQuery(event);
  const year = query.year || new Date().getFullYear();
  const q = query.q || "";

  const apiUrl = `https://api.qa.myhive.in/dividend_announcements?year=${year}`;

  try {
    if (query.q == "columns") {
      const columnsFilePath = resolve(
        "assets/demo/stocks/dividends/dividends_columns.json"
      );
      const columns = JSON.parse(await readFile(columnsFilePath, "utf-8"));
      res.data.columns = columns;
      res.success = true;
      return res;
    }

    // Fetch the data
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Parse JSON response and cast to DividendAnnouncement[]
    res.data.dividends = await response.json();
    res.success = true;

    return res;
  } catch (error) {
    console.error("Error fetching dividend announcements:", error);
    res.success = false;
    res.message = "Failed to fetch dividend announcements.";
    return res;
  }
});
