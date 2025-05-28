declare module '@picovoice/porcupine-web' {
  export class Porcupine {
    static build(
      accessKey: string,
      keywords: string[],
      keywordCallback: (keywordIndex: number) => void
    ): Promise<Porcupine>;

    release(): void;
    process(inputFrame: Int16Array): number;
    sampleRate: number;
    frameLength: number;
    version: string;
  }
}

declare module '@picovoice/web-voice-processor' {
  export class WebVoiceProcessor {
    static subscribe(engine: any): Promise<void>;
    static unsubscribe(engine: any): Promise<void>;
  }
} 