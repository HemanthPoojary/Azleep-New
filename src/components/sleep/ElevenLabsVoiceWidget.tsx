import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Mic, MicOff, Volume2 } from 'lucide-react'

interface ElevenLabsVoiceWidgetProps {
  agentId?: string
  className?: string
  style?: React.CSSProperties
  onConversationStart?: () => void
  onConversationEnd?: () => void
}

export const ElevenLabsVoiceWidget: React.FC<ElevenLabsVoiceWidgetProps> = ({
  agentId = "agent_01jwq3qhggez2r9tafedrvvw0c",
  className = "",
  style = {},
  onConversationStart,
  onConversationEnd
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // Create the widget programmatically to ensure voice mode
    if (containerRef.current) {
      const widget = document.createElement('elevenlabs-convai')
      widget.setAttribute('agent-id', agentId)
      
      // Force voice-only configuration
      widget.setAttribute('voice-mode', 'true')
      widget.setAttribute('auto-start', 'false')
      widget.setAttribute('show-transcript', 'false')
      widget.setAttribute('allow-text', 'false')
      widget.setAttribute('voice-only', 'true')
      
      // Apply styles
      Object.assign(widget.style, {
        width: '100%',
        height: '400px',
        border: 'none',
        borderRadius: '8px',
        ...style
      })

      // Add event listeners
      const handleStart = () => {
        console.log('Voice conversation started')
        setIsVoiceActive(true)
        onConversationStart?.()
      }
      
      const handleEnd = () => {
        console.log('Voice conversation ended')
        setIsVoiceActive(false)
        onConversationEnd?.()
      }

      const handleError = (event: any) => {
        console.error('Voice widget error:', event)
        setHasError(true)
        setErrorMessage('Voice mode not available. Check agent configuration.')
      }

      widget.addEventListener('start', handleStart)
      widget.addEventListener('end', handleEnd)
      widget.addEventListener('error', handleError)
      widget.addEventListener('conversationstart', handleStart)
      widget.addEventListener('conversationend', handleEnd)

      // Clear container and add widget
      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(widget)

      // Force voice mode after widget loads
      setTimeout(() => {
        const element = widget as any
        try {
          if (element.setMode) {
            element.setMode('voice')
          }
          if (element.enableVoiceMode) {
            element.enableVoiceMode()
          }
          if (element.setVoiceOnly) {
            element.setVoiceOnly(true)
          }
        } catch (error) {
          console.warn('Could not set voice mode programmatically:', error)
        }
      }, 2000)

      return () => {
        widget.removeEventListener('start', handleStart)
        widget.removeEventListener('end', handleEnd)
        widget.removeEventListener('error', handleError)
        widget.removeEventListener('conversationstart', handleStart)
        widget.removeEventListener('conversationend', handleEnd)
      }
    }
  }, [agentId, onConversationStart, onConversationEnd])

  if (hasError) {
    return (
      <div className={`elevenlabs-voice-widget-error ${className}`} style={style}>
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <Volume2 className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
            Voice Mode Not Available
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">
            {errorMessage}
          </p>
          <div className="text-xs text-red-500 dark:text-red-400 space-y-1">
            <p>• Check that your agent is configured for voice mode in ElevenLabs dashboard</p>
            <p>• Ensure microphone permissions are granted</p>
            <p>• Verify the agent ID is correct</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`elevenlabs-voice-widget ${className}`} style={style}>
      {/* Voice Status Indicator */}
      <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isVoiceActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Voice Mode {isVoiceActive ? 'Active' : 'Ready'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isVoiceActive ? (
            <MicOff className="h-4 w-4 text-blue-600" />
          ) : (
            <Mic className="h-4 w-4 text-blue-600" />
          )}
        </div>
      </div>

      {/* Widget Container */}
      <div 
        ref={containerRef}
        className="min-h-[400px] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
      />

      {/* Voice Instructions */}
      <div className="mt-4 text-xs text-center text-muted-foreground">
        <p>🎤 Voice-only mode enabled • Grant microphone access when prompted</p>
      </div>
    </div>
  )
} 