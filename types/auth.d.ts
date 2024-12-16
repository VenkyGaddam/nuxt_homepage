declare global {
  type User = {
    Id: string;
    Username: string;
    Password: string;
    Displayname?: string;
    CreatedAt: string;
  };

  type ClientUser = {
    Id: string;
    Username: string;
    Displayname?: string;
  };

  type DecodedToken = {
    id: string;
    username: string;
    displayname: string;
    iat: number;
    exp: number;
  };
}

export {};
