import { Bot, GrammyError, HttpError, InlineKeyboard } from "grammy";
import { sendToBitrix } from "./src/sendToBitrix";
import { config } from "./config";
import { SocksProxyAgent } from "socks-proxy-agent";

const agent = new SocksProxyAgent(
  `socks5h://${config.SOCKS5_PROXY_IP}:${config.SOCKS5_PROXY_PORT}`,
);

const bot = new Bot(config.TG_BOT_TOKEN, {
  client: {
    baseFetchConfig: {
      agent: agent,
      compress: true,
    },
  },
});

bot.hears(/^тикет/i, async (ctx) => {
  const replyToMessage = ctx.update.message?.reply_to_message;
  const chatId = ctx.update.message?.chat.id;
  const messageText = replyToMessage?.text;
  const message = ctx.message?.text;

  if (!chatId || !message) return;
  if (!replyToMessage)
    return ctx.reply("Необходимо ответить командой на сообщение");

  const messageId = replyToMessage.message_id;
  const chatName = ctx.message?.chat.title;

  const chatIdForLink = chatId.toString().replace("-100", "");
  const link = `https://t.me/c/${chatIdForLink}/${messageId}`;

  const ticketNumber = new Date().getTime().toString();

  const userFromTicket: string | undefined = message.split(" ")[1];
  let assignedById = config.DEFAULT_ASSIGNED_BY_ID;

  if (userFromTicket) {
    assignedById =
      config.BITRIX_ID_MAP[
        userFromTicket.toLowerCase() as keyof typeof config.BITRIX_ID_MAP
      ];
  }

  try {
    await sendToBitrix({
      title: `Тикет: ${ticketNumber}`,
      link,
      chatId: chatId.toString(),
      ticketNumber,
      chatName: chatName ?? "",
      description: messageText ?? "",
      assignedById,
    });

    ctx.reply(`Тикет ${ticketNumber} успешно зарегистрирован`);
  } catch (error) {
    console.error(error);
    ctx.reply("Произошла ошибка при регистрации тикета");
  }
});

bot.start({
  onStart({ first_name }) {
    console.log(`Бот ${first_name} начал работать`);
  },
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});
