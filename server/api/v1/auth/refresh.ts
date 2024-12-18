// Refresh Token Endpoint
import jwt from "jsonwebtoken";

export default defineEventHandler((event) => {
  // Get the route path from the event
  const routePath = event.node.req.url || "";
  console.log(`${routePath} - Processing request`);

  const runtimeConfig = useRuntimeConfig();
  const JWT_SECRET = runtimeConfig.jwtToken;
  const JWT_REFRESH_SECRET = runtimeConfig.jwtRefreshToken;
  const TOKEN_EXPIRY = "1h";

  const cookies = parseCookies(event);

  const refreshToken = cookies.refresh_token;

  if (!refreshToken)
    return { success: false, message: "No refresh token provided" };

  try {
    const decoded = jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET
    ) as DecodedToken;
    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        username: decoded.username,
        displayname: decoded.displayname,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    setCookie(event, "auth_token", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
    return {
      success: true,
      message: "Token refreshed successfully",
      data: { newAccessToken, refreshToken },
    };
  } catch (error) {
    return { success: false, message: "Invalid refresh token" };
  }
});
