import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const routePath = event.node.req.url || "";
  console.log(`${routePath} - Processing request`);

  const cookies = parseCookies(event);
  const token = cookies.auth_token;

  const runtimeConfig = useRuntimeConfig();
  const JWT_SECRET = runtimeConfig.jwtToken;

  if (!token) {
    return {
      success: false,
      message: "No token provided",
      data: null,
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken; // Decoding the token with the secret

    // Assuming 'decoded' contains user information like 'id', 'username', etc.
    const user: UserPayload = {
      id: decoded.id,
      username: decoded.username,
      displayname: decoded.displayname || "Anonymous",
    };

    return {
      success: true,
      message: "Authenticated successfully",
      data: user, // Returning user details in the response
    };
  } catch (error) {
    return {
      success: false,
      message: "Invalid or expired token",
      data: null,
    };
  }
});
