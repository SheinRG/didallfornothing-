import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

/**
 * Convert text to speech using Edge TTS (Microsoft Azure Neural).
 * Returns an audio Buffer (mp3) that can be streamed to the client.
 */
export async function textToSpeech(text) {
  try {
    const tts = new MsEdgeTTS();
    
    // Choose voice and output format
    // Other highly natural options: 'en-US-JennyNeural', 'en-US-GuyNeural', 'en-US-SteffanNeural'
    await tts.setMetadata('en-US-AriaNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    
    // Start stream - prepend a short pause to ensure the browser audio decoder doesn't skip the first word
    const { audioStream } = tts.toStream("... " + text);
    
    return new Promise((resolve, reject) => {
      const chunks = [];
      audioStream.on('data', chunk => chunks.push(chunk));
      audioStream.on('end', () => resolve(Buffer.concat(chunks)));
      audioStream.on('error', err => reject(err));
    });
  } catch (err) {
    throw new Error(`Edge TTS generation failed: ${err.message}`);
  }
}
