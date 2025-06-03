import React from 'react'
import { ElevenLabsAgent } from '../components/sleep/ElevenLabsAgent'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Bot, Mic, Zap } from 'lucide-react'

export const ElevenLabsDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ElevenLabs AI Agent Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Test the ElevenLabs conversational AI agent integration with your Sleep Genie
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-500" />
                ElevenLabs AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced conversational AI with natural voice interaction powered by ElevenLabs.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-green-500" />
                Voice Interface
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Speak naturally with the AI agent using your microphone and receive audio responses.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                Real-time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Low-latency voice processing for natural, flowing conversations.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>ElevenLabs Agent Interface</CardTitle>
            <CardDescription>
              Click "Start" to begin your conversation with the AI sleep assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ElevenLabsAgent
              agentId="agent_01jwq3qhggez2r9tafedrvvw0c"
              onConversationStart={() => console.log('ElevenLabs conversation started')}
              onConversationEnd={() => console.log('ElevenLabs conversation ended')}
            />
          </CardContent>
        </Card>

        <Card className="mt-8 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
            <CardDescription>
              Instructions for interacting with the ElevenLabs AI agent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2 mt-1">
                  <span className="text-blue-600 dark:text-blue-300 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold">Grant Microphone Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Allow microphone permissions when prompted to enable voice interaction.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-900 rounded-full p-2 mt-1">
                  <span className="text-green-600 dark:text-green-300 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold">Start Conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the "Start" button to activate the AI agent and begin speaking.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-2 mt-1">
                  <span className="text-purple-600 dark:text-purple-300 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold">Natural Conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Speak naturally about sleep, relaxation, or ask for guidance. The AI will respond with voice.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Agent ID: agent_01jwq3qhggez2r9tafedrvvw0c
          </p>
        </div>
      </div>
    </div>
  )
} 