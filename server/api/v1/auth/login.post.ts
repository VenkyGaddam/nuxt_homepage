import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const runtimeConfig = useRuntimeConfig();
const JWT_SECRET = runtimeConfig.jwtToken;
const JWT_REFRESH_SECRET = runtimeConfig.jwtRefreshToken; // Refresh token secret

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  const { username, password } = await readBody(event);

  if (!username || !password) {
    return {
      success: false,
      message: "Username and password are required",
    };
  }

  const usersFilePath = resolve("assets/demo/users.json");
  let users: User[] = [];

  try {
    // Load existing users
    users = JSON.parse(await readFile(usersFilePath, "utf-8"));
  } catch (error) {
    console.error("Error reading users file:", error);
  }

  // Find the user in the JSON data
  const existingUser = users.find((u) => u.Username === username);

  if (existingUser) {
    // Validate the password
    const validPassword = await bcrypt.compare(password, existingUser.Password);

    if (!validPassword) {
      return {
        success: false,
        message: "Invalid password",
      };
    }

    // Check for duplicate user ID
    const userById = users.find((u) => u.Id === existingUser.Id);
    if (userById) {
      // Create new tokens
      const token = jwt.sign(
        {
          id: userById.Id,
          username: userById.Username,
          displayname: userById.Displayname,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { id: userById.Id, username: userById.Username },
        JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      return {
        success: true,
        data: { token, refreshToken },
      };
    }
  }

  // Create a new user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    Id: crypto.randomUUID(),
    Username: username,
    Password: hashedPassword,
    Displayname: username,
    CreatedAt: new Date().toISOString(),
  };

  users.push(newUser);

  try {
    // Save the updated users list
    await writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing users file:", error);
    return {
      success: false,
      message: "Failed to create user",
    };
  }

  // Generate tokens
  const token = jwt.sign(
    {
      id: newUser.Id,
      username: newUser.Username,
      displayname: newUser.Displayname,
    },
    JWT_SECRET,
    { expiresIn: "12h" }
  );

  const refreshToken = jwt.sign(
    { id: newUser.Id, username: newUser.Username },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return {
    success: true,
    data: { token, refreshToken },
  };
});
