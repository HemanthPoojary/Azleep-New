import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, X, Bot } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ElevenLabsConvAI } from './ElevenLabsConvAI'

interface ElevenLabsFloatingWidgetProps {
  agentId?: string
  className?: string
}

export const ElevenLabsFloatingWidget: React.FC<ElevenLabsFloatingWidgetProps> = ({
  agentId = "agent_01jwq3qhggez2r9tafedrvvw0c",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isConversationActive, setIsConversationActive] = useState(false)

  const handleConversationStart = () => {
    setIsConversationActive(true)
  }

  const handleConversationEnd = () => {
    setIsConversationActive(false)
  }

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={`fixed bottom-6 right-6 z-50 ${className}`}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg transition-all duration-200 group relative"
        >
          <Mic className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
          
          {/* Active conversation indicator */}
          {isConversationActive && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
          )}
          
          {/* Ripple effect */}
          <div className="absolute -inset-1 bg-blue-500/30 rounded-full animate-ping" />
          <div className="absolute -inset-2 bg-blue-500/20 rounded-full animate-ping" style={{ animationDelay: "0.2s" }} />
        </Button>
      </motion.div>

      {/* Floating Widget Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-500" />
                    Sleep Genie AI
                    {isConversationActive && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        Active
                      </span>
                    )}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
                      Speak with your AI sleep assistant for personalized guidance and support.
                    </p>
                  </div>
                  
                  <ElevenLabsConvAI
                    agentId={agentId}
                    onConversationStart={handleConversationStart}
                    onConversationEnd={handleConversationEnd}
                    style={{ 
                      height: '300px',
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))'
                    }}
                  />
                  
                  <div className="mt-4 text-xs text-center text-muted-foreground">
                    Powered by ElevenLabs ConvAI
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 