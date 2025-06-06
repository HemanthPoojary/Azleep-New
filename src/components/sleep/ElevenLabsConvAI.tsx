import React, { useEffect, useRef } from 'react'

interface ElevenLabsConvAIProps {
  agentId?: string
  className?: string
  style?: React.CSSProperties
  onConversationStart?: () => void
  onConversationEnd?: () => void
}

// Declare the custom element type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': {
        'agent-id': string
        'voice-mode'?: string
        'auto-start'?: string
        'show-transcript'?: string
        'allow-text'?: string
        ref?: React.Ref<any>
        style?: React.CSSProperties
        className?: string
        children?: React.ReactNode
      }
    }
  }
}

export const ElevenLabsConvAI: React.FC<ElevenLabsConvAIProps> = ({
  agentId = "agent_01jwq3qhggez2r9tafedrvvw0c",
  className = "",
  style = {},
  onConversationStart,
  onConversationEnd
}) => {
  const widgetRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Wait for the widget to be ready and attach event listeners
    const widget = widgetRef.current
    if (widget) {
      // Listen for custom events if the widget supports them
      const handleStart = () => {
        console.log('ElevenLabs ConvAI conversation started')
        onConversationStart?.()
      }
      
      const handleEnd = () => {
        console.log('ElevenLabs ConvAI conversation ended')
        onConversationEnd?.()
      }

      // Add event listeners if the widget supports them
      widget.addEventListener('conversationstart', handleStart)
      widget.addEventListener('conversationend', handleEnd)
      
      // Also try common event names
      widget.addEventListener('start', handleStart)
      widget.addEventListener('end', handleEnd)
      widget.addEventListener('stop', handleEnd)

      // Try to force voice mode programmatically
      setTimeout(() => {
        const element = widget as any
        if (element.setVoiceMode) {
          element.setVoiceMode(true)
        }
        if (element.enableVoice) {
          element.enableVoice()
        }
      }, 1000)

      return () => {
        widget.removeEventListener('conversationstart', handleStart)
        widget.removeEventListener('conversationend', handleEnd)
        widget.removeEventListener('start', handleStart)
        widget.removeEventListener('end', handleEnd)
        widget.removeEventListener('stop', handleEnd)
      }
    }
  }, [onConversationStart, onConversationEnd])

  return (
    <div className={`elevenlabs-convai-container ${className}`} style={style}>
      <elevenlabs-convai 
        agent-id={agentId}
        voice-mode="true"
        auto-start="false"
        show-transcript="false"
        allow-text="false"
        ref={widgetRef}
        style={{
          width: '100%',
          height: '400px',
          border: 'none',
          borderRadius: '8px',
          ...style
        }}
      />
    </div>
  )
} 