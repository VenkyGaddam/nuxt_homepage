declare global {
  type User = {
    Id: string;
    Username: string;
    Password: string;
    Displayname?: string;
    CreatedAt: string;
  };

  type UserPayload = {
    id: string;
    username: string;
    displayname: string;
  };

  interface DecodedToken extends UserPayload {
    exp: number;
    iat: number;
  }
}

export {};
