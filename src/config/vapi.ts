import Vapi from "@vapi-ai/web";

interface VapiOptions {
  webhookUrl?: string;
  language?: string;
  continuous?: boolean;
}

interface VapiCall {
  on: (event: string, handler: (data: any) => void) => void;
  off: (event: string) => void;
  stop: () => void;
  start: () => void;
  say: (text: string) => void;
  setMuted: (muted: boolean) => void;
}

interface AssistantOptions {
  assistantId: string;
  context?: {
    mood: string;
    userState: string;
  };
}

export const createSleepGenieAssistant = (mood: string): AssistantOptions => {
  return {
    assistantId: import.meta.env.VITE_VAPI_ASSISTANT_ID,
    context: {
      mood: mood,
      userState: `The user is currently feeling ${mood}. Tailor responses to their emotional state while focusing on sleep improvement.`
    }
  };
};

// Create a singleton instance
const vapi = new Vapi(import.meta.env.VITE_VAPI_API_KEY);

// Configure webhook if URL is provided
if (import.meta.env.VITE_VAPI_WEBHOOK_URL) {
  vapi.send({
    type: 'add-message',
    message: {
      role: 'system',
      content: `Webhook URL configured: ${import.meta.env.VITE_VAPI_WEBHOOK_URL}`
    }
  });
}

export const start = async (assistantId: string) => {
  try {
    const call = await vapi.start(assistantId);
    return call;
  } catch (error) {
    console.error('Error starting Vapi call:', error);
    throw error;
  }
};

export default vapi;