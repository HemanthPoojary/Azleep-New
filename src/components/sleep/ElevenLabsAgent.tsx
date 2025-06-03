import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Mic, MicOff, Volume2, VolumeX, Bot } from 'lucide-react'

interface ElevenLabsAgentProps {
  agentId?: string
  onConversationStart?: () => void
  onConversationEnd?: () => void
  className?: string
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': {
        'agent-id': string
        ref?: React.Ref<any>
        style?: React.CSSProperties
        className?: string
        children?: React.ReactNode
      }
    }
  }
}

export const ElevenLabsAgent: React.FC<ElevenLabsAgentProps> = ({
  agentId = "agent_01jwq3qhggez2r9tafedrvvw0c",
  onConversationStart,
  onConversationEnd,
  className = ""
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [isAgentActive, setIsAgentActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const widgetRef = useRef<any>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    // Load ElevenLabs script if not already loaded
    if (!document.querySelector('script[src*="elevenlabs/convai-widget-embed"]')) {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
      script.async = true
      script.type = 'text/javascript'
      
      script.onload = () => {
        setIsScriptLoaded(true)
        console.log('ElevenLabs script loaded successfully')
      }
      
      script.onerror = () => {
        console.error('Failed to load ElevenLabs script')
      }
      
      document.head.appendChild(script)
      scriptRef.current = script
    } else {
      setIsScriptLoaded(true)
    }

    return () => {
      // Cleanup script if component unmounts
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isScriptLoaded && widgetRef.current) {
      // Listen for widget events if they're available
      const widget = widgetRef.current as any
      
      // Try to detect when conversation starts/ends
      // Note: ElevenLabs might not expose these events, but we can try
      const handleConversationStart = () => {
        setIsAgentActive(true)
        onConversationStart?.()
      }
      
      const handleConversationEnd = () => {
        setIsAgentActive(false)
        onConversationEnd?.()
      }

      // Check if the widget exposes events
      if (widget.addEventListener) {
        widget.addEventListener('conversationstart', handleConversationStart)
        widget.addEventListener('conversationend', handleConversationEnd)
        
        return () => {
          widget.removeEventListener('conversationstart', handleConversationStart)
          widget.removeEventListener('conversationend', handleConversationEnd)
        }
      }
    }
  }, [isScriptLoaded, onConversationStart, onConversationEnd])

  const toggleMute = () => {
    setIsMuted(!isMuted)
    // Try to control the widget's audio if possible
    const widget = widgetRef.current as any
    if (widget && widget.mute) {
      widget.mute(!isMuted)
    }
  }

  const startConversation = () => {
    const widget = widgetRef.current as any
    if (widget && widget.start) {
      widget.start()
    }
    setIsAgentActive(true)
    onConversationStart?.()
  }

  const stopConversation = () => {
    const widget = widgetRef.current as any
    if (widget && widget.stop) {
      widget.stop()
    }
    setIsAgentActive(false)
    onConversationEnd?.()
  }

  if (!isScriptLoaded) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Bot className="h-6 w-6 text-blue-500 mr-2" />
            <span className="text-lg font-semibold text-blue-600">ElevenLabs AI</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading ElevenLabs AI Agent...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`elevenlabs-agent-container ${className}`} style={{ width: '100%', minHeight: '300px' }}>
      {/* Enhanced Control Header */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
        <div className="flex items-center gap-3">
          <Bot className="h-5 w-5 text-blue-500" />
          <div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isAgentActive ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                ElevenLabs AI Agent
              </span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs">
                {isAgentActive ? '🎤 Speaking' : '⏸️ Ready'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Conversational AI powered by ElevenLabs
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={toggleMute}
            className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-blue-600" /> : <Volume2 className="h-4 w-4 text-blue-600" />}
          </Button>
          
          <Button
            size="sm"
            variant={isAgentActive ? "destructive" : "default"}
            onClick={isAgentActive ? stopConversation : startConversation}
            className={`h-8 px-3 ${!isAgentActive ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}`}
          >
            {isAgentActive ? (
              <>
                <MicOff className="h-4 w-4 mr-1" />
                Stop
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-1" />
                Start
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Welcome Message for ElevenLabs */}
      {!isAgentActive && (
        <div className="text-center py-6 mb-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-200/30">
          <Bot className="h-12 w-12 mx-auto mb-3 text-blue-500" />
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
            ElevenLabs Sleep Genie
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Click "Start" to begin a natural voice conversation with our AI sleep assistant
          </p>
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            <Bot className="h-3 w-3 mr-1" />
            Powered by ElevenLabs
          </Badge>
        </div>
      )}

      {/* ElevenLabs Widget */}
      <div 
        className={`elevenlabs-widget-wrapper border-2 ${isAgentActive ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-blue-200'} rounded-lg overflow-hidden`}
        style={{
          width: '100%',
          height: isAgentActive ? '400px' : '300px',
          background: 'var(--background)',
          transition: 'all 0.3s ease'
        }}
      >
        <elevenlabs-convai 
          ref={widgetRef}
          agent-id={agentId}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      {/* Status Footer */}
      {isAgentActive && (
        <div className="mt-4 text-center">
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2" />
            ElevenLabs AI Active • Agent ID: {agentId.slice(-8)}
          </Badge>
        </div>
      )}
    </div>
  )
} 