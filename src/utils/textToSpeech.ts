import axios from 'axios';

const ELEVEN_LABS_API_KEY = process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY;
const VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Default male voice

interface TextToSpeechOptions {
  text: string;
  voiceId?: string;
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export async function textToSpeech({ text, voiceId = VOICE_ID }: TextToSpeechOptions): Promise<ArrayBuffer> {
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVEN_LABS_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error converting text to speech:', error);
    throw error;
  }
}

export async function playAudioBuffer(audioBuffer: ArrayBuffer): Promise<void> {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioBufferSource = audioContext.createBufferSource();

  try {
    const decodedData = await audioContext.decodeAudioData(audioBuffer);
    audioBufferSource.buffer = decodedData;
    audioBufferSource.connect(audioContext.destination);
    audioBufferSource.start(0);

    return new Promise((resolve) => {
      audioBufferSource.onended = () => {
        audioContext.close();
        resolve();
      };
    });
  } catch (error) {
    console.error('Error playing audio:', error);
    audioContext.close();
    throw error;
  }
} 