declare global {
  type Service = {
    id: string;
    service: string;
    description: string;
    address: string;
    reverse_proxy: string;
    active: boolean;
    icon: string;
  };

  type Column = {
    key: string;
    label: string;
    class?: string;
  };
}

export {};
