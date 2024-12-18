import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const runtimeConfig = useRuntimeConfig();
const JWT_SECRET = runtimeConfig.jwtToken;
const JWT_REFRESH_SECRET = runtimeConfig.jwtRefreshToken;
const TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_EXPIRY = "7d";

export default defineEventHandler(async (event) => {
  // Get the route path from the event
  const routePath = event.node.req.url || "";
  console.log(`${routePath} - Processing request`);

  const { username, password } = await readBody<
    Partial<{ username: string; password: string }>
  >(event);
  if (!username || !password)
    return { success: false, message: "Username and password are required" };

  const usersFilePath = resolve("assets/demo/users.json");
  const users: User[] = JSON.parse(await readFile(usersFilePath, "utf-8"));
  const existingUser = users.find((u) => u.Username === username);

  if (
    !existingUser ||
    !(await bcrypt.compare(password, existingUser.Password))
  ) {
    return { success: false, message: "Invalid username or password" };
  }

  const accessToken = jwt.sign(
    {
      id: existingUser.Id,
      username: existingUser.Username,
      displayname: existingUser.Displayname,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { id: existingUser.Id, username: existingUser.Username },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  setCookie(event, "auth_token", accessToken, {
    httpOnly: true, // Not accessible via JavaScript
    secure: true, // Only sent over HTTPS
    sameSite: "strict", // Ensures the cookie is sent with same-origin requests
    path: "/", // Available across the entire app
    maxAge: 60 * 60,
  });

  setCookie(event, "refresh_token", refreshToken, {
    httpOnly: true, // Not accessible via JavaScript
    secure: true, // Only sent over HTTPS
    sameSite: "strict", // Ensures the cookie is sent with same-origin requests
    path: "/", // Available across the entire app
    maxAge: 60 * 60 * 24 * 7,
  });

  return {
    success: true,
    message: "Login successful",
    data: { accessToken, refreshToken },
  };
});
