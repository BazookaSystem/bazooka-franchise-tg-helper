import "dotenv/config";

export const config = {
  TG_BOT_TOKEN: process.env.TG_BOT_TOKEN!,
  BITRIX_TOKEN: process.env.BITRIX_TOKEN!,
  SOCKS5_PROXY_IP: process.env.SOCKS5_PROXY_IP!,
  SOCKS5_PROXY_PORT: process.env.SOCKS5_PROXY_PORT!,
  BITRIX_ID_MAP: {
    а: 74,
    "1": 74,
    л: 78,
    "2": 78,
    м: 108,
    "3": 108,
    э: 3340,
    "4": 3340,
  } as const,
  DEFAULT_ASSIGNED_BY_ID: +process.env.DEFAULT_ASSIGNED_BY_ID!,
};

Object.entries(config).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`ENV переменна ${key} не найдена`);
  }
});
