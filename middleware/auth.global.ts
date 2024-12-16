export default defineNuxtRouteMiddleware((to, from) => {
  const { login, isLoading, error, isAuth, isValidToken } = useAuth();

  let isLoggedIn = isAuth.value;

  console.log(`from page: ${from.path} to page: ${to.path}`);
  // if (to.path == from.path) {
  console.log(`isLoggedIn: ${isLoggedIn}`);

  // if (isLoggedIn) {
  //   console.log(`authMiddleware: valid auth and token`);
  //   return;
  // } else if (to.path !== "/login") {
  //   // if not authorized or invalid then navigate to login screen
  //   return navigateTo("/login");
  // }
  return;
  // }

  // if (import.meta.server) {
  //   // Skip middleware if running on the server
  //   console.log("auth: " + "Ruuning in server");
  //   return;
  // }

  // if (isLoggedIn) {
  //   console.log(`authMiddleware: valid auth and token`);
  //   if (to.path == "/login") {
  //     return navigateTo("/");
  //   }
  //   return;
  // } else if (to.path !== "/login") {
  //   // if not authorized or invalid then navigate to login screen
  //   return navigateTo("/login");
  // }
  return;
});
