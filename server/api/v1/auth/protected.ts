import jwt from "jsonwebtoken";
export default defineEventHandler(async (event) => {
  // Get the route path from the event
  const routePath = event.node.req.url || "";
  console.log(`${routePath} - Processing request`);

  const cookies = parseCookies(event);

  const authToken = cookies.auth_token;
  const refreshToken = cookies.refresh_token;

  const runtimeConfig = useRuntimeConfig();
  const JWT_SECRET = runtimeConfig.jwtToken;
  const JWT_REFRESH_SECRET = runtimeConfig.jwtRefreshToken;
  const TOKEN_EXPIRY = "1h";

  if (!authToken) {
    return { success: false, message: "Authentication required" };
  }

  try {
    const decodedToken = jwt.verify(authToken, JWT_SECRET) as DecodedToken;
    event.context.user = decodedToken;

    // If the token is expired, use the refresh token
    if (decodedToken.exp < Date.now() / 1000) {
      if (!refreshToken) {
        throw new Error("Refresh token missing");
      }
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        JWT_REFRESH_SECRET
      ) as DecodedToken;

      // Refresh the access token
      const newAccessToken = jwt.sign(
        {
          id: decodedRefreshToken.id,
          username: decodedRefreshToken.username,
          displayname: decodedRefreshToken.displayname,
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );
      setCookie(event, "auth_token", newAccessToken, {
        httpOnly: true, // Not accessible via JavaScript
        secure: true, // Only sent over HTTPS
        sameSite: "strict", // Ensures the cookie is sent with same-origin requests
        path: "/", // Available across the entire app
      });
    }

    return { success: true, message: "Access granted" };
  } catch (e) {
    return { success: false, message: "Authentication failed" };
  }
});
