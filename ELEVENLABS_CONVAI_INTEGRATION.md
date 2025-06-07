# ElevenLabs ConvAI Integration

This document explains how the ElevenLabs ConvAI voice agent has been integrated into your Sleep Genie application.

## Overview

The integration provides multiple ways to interact with the ElevenLabs ConvAI voice agent:

1. **Direct Widget Embed** - Using the official ElevenLabs ConvAI widget
2. **Enhanced Custom Interface** - Custom React component with additional controls
3. **Floating Widget** - Modal-based voice assistant

## Agent Configuration

- **Agent ID**: `agent_01jx21rsq8e8yre3fnt3k6g23j`
- **SDK**: `@elevenlabs/convai-widget-embed`
- **Documentation**: https://elevenlabs.io/docs/conversational-ai/overview

## Implementation Details

### 1. Script Integration

The ElevenLabs ConvAI script is loaded in `index.html`:

```html
<script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
```

### 2. Direct Widget Component

Located at: `src/components/sleep/ElevenLabsConvAI.tsx`

```tsx
<ElevenLabsConvAI
  agentId="agent_01jx21rsq8e8yre3fnt3k6g23j"
  onConversationStart={() => console.log('Started')}
  onConversationEnd={() => console.log('Ended')}
/>
```

### 3. Enhanced Custom Interface

Located at: `src/components/sleep/ElevenLabsAgent.tsx`

Provides additional features:
- Visual status indicators
- Custom start/stop controls
- Mute functionality
- Enhanced UI feedback

### 4. Floating Widget

Located at: `src/components/sleep/ElevenLabsFloatingWidget.tsx`

Features:
- Floating action button
- Modal dialog interface
- Conversation status indicators
- Smooth animations

## Available Pages

1. **ElevenLabs Demo** (`/app/elevenlabs`) - Comparison of both implementations
2. **ConvAI Test** (`/app/convai-test`) - Direct widget testing with examples

## Usage Examples

### Basic Integration

```tsx
import { ElevenLabsConvAI } from './components/sleep/ElevenLabsConvAI'

function MyComponent() {
  return (
    <ElevenLabsConvAI 
      agentId="agent_01jx21rsq8e8yre3fnt3k6g23j"
      style={{ height: '400px' }}
    />
  )
}
```

### With Event Handlers

```tsx
import { ElevenLabsConvAI } from './components/sleep/ElevenLabsConvAI'

function MyComponent() {
  const handleStart = () => {
    console.log('Conversation started')
  }
  
  const handleEnd = () => {
    console.log('Conversation ended')
  }

  return (
    <ElevenLabsConvAI 
      agentId="agent_01jx21rsq8e8yre3fnt3k6g23j"
      onConversationStart={handleStart}
      onConversationEnd={handleEnd}
    />
  )
}
```

### Floating Widget

```tsx
import { ElevenLabsFloatingWidget } from './components/sleep/ElevenLabsFloatingWidget'

function App() {
  return (
    <div>
      {/* Your app content */}
      <ElevenLabsFloatingWidget />
    </div>
  )
}
```

## Customization

### Styling

The widget can be styled using CSS or inline styles:

```tsx
<ElevenLabsConvAI 
  style={{
    height: '300px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0'
  }}
  className="my-custom-class"
/>
```

### Agent Configuration

To use a different agent, simply change the `agentId` prop:

```tsx
<ElevenLabsConvAI agentId="your-agent-id-here" />
```

## Benefits of Direct Integration

1. **Official Support** - Using the official ElevenLabs SDK
2. **Automatic Updates** - Widget updates automatically
3. **Optimized Performance** - Built-in optimizations
4. **Reliable** - Maintained by ElevenLabs team
5. **Simple Setup** - Minimal configuration required

## Troubleshooting

### Common Issues

1. **Widget not loading**: Check console for script loading errors
2. **No audio**: Ensure microphone permissions are granted
3. **Agent not responding**: Verify the agent ID is correct

### Debug Tips

- Check browser console for errors
- Verify microphone permissions
- Test with a simple HTML page first
- Ensure the agent is published and active

## Next Steps

1. Customize the agent's personality and responses in ElevenLabs dashboard
2. Add error handling for network issues
3. Implement analytics tracking for conversations
4. Add voice activity detection indicators
5. Integrate with your app's user authentication system 

<elevenlabs-convai agent-id="agent_01jx21rsq8e8yre3fnt3k6g23j"></elevenlabs-convai>
<script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script> 