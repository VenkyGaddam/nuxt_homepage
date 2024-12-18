export default defineNuxtRouteMiddleware(async (to, from) => {
  // Allow access to the login page without middleware logic
  if (to.path === "/login") return;

  if (import.meta.client) {
    const response: ApiResponse = await $fetch("/api/v1/auth/protected", {
      method: "GET",
    });

    if (response.success) {
      return;
    } else {
      return navigateTo("/login");
    }
  }
});
