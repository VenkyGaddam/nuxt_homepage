declare global {
  type ApiResponse = {
    success: boolean;
    data?: any;
    message?: string;
  };
}

export {};
