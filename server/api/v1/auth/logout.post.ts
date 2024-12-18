// Logout Endpoint
export default defineEventHandler((event) => {
  // Get the route path from the event
  const routePath = event.node.req.url || "";
  console.log(`${routePath} - Processing request`);

  deleteCookie(event, "auth_token");
  deleteCookie(event, "refresh_token");
  return { success: true, message: "Logged out successfully" };
});
