import { App_url } from "@/constant/static";

export async function sendChatMessage(message: string, sessionId: string) {
  const res = await fetch(App_url.chat_bot_url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });


  if (!res.ok) {
    throw new Error("Chat API failed");
  }

  return res.json();
}

export interface ZeccoAIResponse {
  response: string;
  sessionId: string;
  properties?: Array<{
    _id: string;
    uID?: string;
    slug?: string;
    salePrice?: number;
    rentalPrice?: number;
    rentalPriceLong?: number;
    bedrooms?: number;
    bathrooms?: number;
    mtsBuild?: number;
    locationCity?: string;
    locationArea?: string;
    propertyType?: { id: number; name: string };
    isSale?: boolean;
    isRent?: boolean;
    imageUrl?: string | null;
  }>;
  suggestions?: Array<{
    text: string;
    searchCriteria: Record<string, any>;
  }>;
}

export async function sendZeccoAIMessage(
  message: string,
  sessionId: string,
  userId?: string,
): Promise<ZeccoAIResponse> {
  const baseUrl = App_url.zecco_ai_url;
  const body: Record<string, string> = { message, sessionId };
  if (userId) {
    body.user_id = userId;
  }

  const res = await fetch(`${baseUrl}/api/realestate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Zecco AI API failed");
  }

  return res.json();
}
