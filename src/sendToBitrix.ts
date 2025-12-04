import { config } from "../config";

export const sendToBitrix = async ({
  title,
  link,
  chatId,
  ticketNumber,
  chatName,
  description,
  assignedById,
}: {
  title: string;
  link: string;
  chatId: string;
  ticketNumber: string;
  chatName: string;
  description: string;
  assignedById: number;
}) => {
  const url = `https://bazooka.bitrix24.ru/rest/102/${config.BITRIX_TOKEN}/crm.item.add?entityTypeId=1060&fields[TITLE]=${title}&fields[ufCrm80_1764848300]=${link}&fields[ufCrm80_1764848337]=${chatId}&fields[ufCrm80_1764848349]=${ticketNumber}&fields[ufCrm80_1740987309]=${description}&fields[ufCrm80_1764848372]=${chatName}&fields[ASSIGNED_BY_ID]=${assignedById}`;

  const response = await fetch(url, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Не удалось сохранить тикет");
  }
  const json = await response.json();

  console.log(json);
  return json;
};
