import { App_url } from "@/constant/static";

export async function sendChatMessage(message: string, sessionId: string) {
  const res = await fetch(App_url.chat_bot_url_main, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!res.ok) {
    throw new Error("Chat API failed");
  }

  return res.json();
}
