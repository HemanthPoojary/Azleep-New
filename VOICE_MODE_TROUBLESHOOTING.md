# ElevenLabs ConvAI Voice Mode Troubleshooting

## 🚨 Problem: Seeing Text Chat Instead of Voice

If you're seeing a text chat interface instead of voice interaction, here's how to fix it:

## 🔧 Immediate Solutions

### 1. **Check Agent Configuration in ElevenLabs Dashboard**

**Most Common Cause**: Your agent might be configured for text mode instead of voice mode.

**Fix Steps:**
1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/app/conversational-ai)
2. Find your agent: `agent_01jwq3qhggez2r9tafedrvvw0c`
3. Check the **"Interface"** or **"Mode"** settings
4. Ensure **"Voice"** or **"Audio"** is enabled
5. Disable **"Text-only"** mode if it's active
6. Save changes and test again

### 2. **Grant Microphone Permissions**

**Chrome/Edge:**
- Look for 🎤 icon in address bar
- Click and select "Always allow"
- Refresh the page

**Firefox:**
- Look for microphone permission notification
- Click "Allow" when prompted
- Check site permissions in settings

**Safari:**
- Go to Safari > Preferences > Websites > Microphone
- Set your site to "Allow"

### 3. **Try the Voice-Only Widget**

Use our specially configured voice-only widget:

**Visit:** `/app/convai-test`
**Click:** "Voice-Only Widget" tab

This widget forces voice mode with these attributes:
```html
<elevenlabs-convai 
  agent-id="agent_01jwq3qhggez2r9tafedrvvw0c"
  voice-mode="true"
  allow-text="false"
  voice-only="true"
/>
```

## 🔍 Diagnostic Steps

### Test Your Setup:

1. **Check Browser Console (F12):**
   ```javascript
   // Test microphone access
   navigator.mediaDevices.getUserMedia({audio: true})
     .then(() => console.log('✅ Microphone access granted'))
     .catch(err => console.log('❌ Microphone blocked:', err));
   
   // Check widget configuration
   document.querySelectorAll('elevenlabs-convai').forEach(widget => {
     console.log('Widget found:', widget);
     console.log('Voice mode:', widget.getAttribute('voice-mode'));
     console.log('Allow text:', widget.getAttribute('allow-text'));
   });
   ```

2. **Network Tab Check:**
   - Look for successful requests to ElevenLabs API
   - Check for WebSocket connections (voice mode uses WebSockets)
   - Verify no 403/401 errors

3. **Audio Test:**
   - Test your microphone in other apps
   - Try different browsers (Chrome recommended)
   - Check system audio settings

## 🛠️ Advanced Fixes

### If Voice Mode Still Not Working:

#### Option A: Programmatic Voice Mode
```tsx
// Force voice mode after widget loads
setTimeout(() => {
  const widget = document.querySelector('elevenlabs-convai') as any;
  if (widget) {
    widget.setMode?.('voice');
    widget.enableVoiceMode?.();
    widget.setVoiceOnly?.(true);
  }
}, 2000);
```

#### Option B: Recreate Widget with Voice Config
```tsx
const widget = document.createElement('elevenlabs-convai');
widget.setAttribute('agent-id', 'agent_01jwq3qhggez2r9tafedrvvw0c');
widget.setAttribute('voice-mode', 'true');
widget.setAttribute('allow-text', 'false');
widget.setAttribute('voice-only', 'true');
container.appendChild(widget);
```

#### Option C: Check Agent Status
Verify your agent supports voice:
1. Test agent directly on ElevenLabs platform
2. Check agent's voice model is configured
3. Verify account has voice minutes available
4. Ensure agent is published and active

## 🎯 Component Usage

### Use Voice-Only Widget:
```tsx
import { ElevenLabsVoiceWidget } from './components/sleep/ElevenLabsVoiceWidget'

<ElevenLabsVoiceWidget 
  agentId="agent_01jwq3qhggez2r9tafedrvvw0c" 
/>
```

### Use Standard Widget with Voice Forced:
```tsx
import { ElevenLabsConvAI } from './components/sleep/ElevenLabsConvAI'

<ElevenLabsConvAI 
  agentId="agent_01jwq3qhggez2r9tafedrvvw0c"
  // Voice mode is already configured in the component
/>
```

## 🔍 Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Microphone access denied" | Browser permissions | Grant microphone access |
| "Agent not found" | Wrong agent ID | Verify agent ID is correct |
| "Text mode only" | Agent configuration | Enable voice in ElevenLabs dashboard |
| "WebSocket connection failed" | Network/API issue | Check internet, try different browser |
| "Voice model not available" | Account/agent limits | Check ElevenLabs account status |

## 📋 Checklist

Before reporting issues, verify:

- [ ] Agent configured for voice mode in ElevenLabs dashboard
- [ ] Microphone permissions granted in browser
- [ ] Tested in Chrome/Edge (best compatibility)
- [ ] Console shows no JavaScript errors
- [ ] Agent ID is correct: `agent_01jwq3qhggez2r9tafedrvvw0c`
- [ ] ElevenLabs account has available voice minutes
- [ ] Internet connection is stable
- [ ] Tested on `/app/convai-test` page
- [ ] Tried the "Voice-Only Widget" tab

## 🆘 Still Having Issues?

1. **Test Direct HTML:**
   Create a simple HTML file:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async></script>
   </head>
   <body>
     <elevenlabs-convai 
       agent-id="agent_01jwq3qhggez2r9tafedrvvw0c"
       voice-mode="true"
       allow-text="false">
     </elevenlabs-convai>
   </body>
   </html>
   ```

2. **Check ElevenLabs Documentation:**
   - [Conversational AI Overview](https://elevenlabs.io/docs/conversational-ai/overview)
   - [Widget Configuration](https://elevenlabs.io/docs/conversational-ai/widget)

3. **Contact ElevenLabs Support:**
   If the issue persists, it might be an agent configuration issue that needs to be resolved in your ElevenLabs account.

## ✅ Success Indicators

You know voice mode is working when:
- 🎤 You see a microphone icon (not a text input)
- 🗣️ Speaking triggers visual feedback
- 🔊 You hear AI voice responses
- 📊 Console shows "Voice conversation started"
- 🌊 No text chat interface is visible 