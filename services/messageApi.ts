import { MessageComposeRequest, MessageComposeResponse } from "@/types/message";

class MessageApi {
  private baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

  /**
   * Send a message to be translated
   */
  async composeMessage(
    request: MessageComposeRequest,
    accessToken?: string,
  ): Promise<MessageComposeResponse> {
    const requestJson = JSON.stringify(request);

    const headers: Record<string, string> = {};

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/api/message/compose`, {
      method: "POST",
      body: requestJson,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Message Compose failed: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();

    // Extract result from the response wrapper
    if (data.isSuccess && data.result) {
      return data.result;
    } else {
      throw new Error(data.message || "Message Compose failed");
    }
  }
}

export const messageApi = new MessageApi();
