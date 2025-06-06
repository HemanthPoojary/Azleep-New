import React from 'react'
import { ElevenLabsConvAI } from '../components/sleep/ElevenLabsConvAI'
import { ElevenLabsVoiceWidget } from '../components/sleep/ElevenLabsVoiceWidget'
import { ElevenLabsFloatingWidget } from '../components/sleep/ElevenLabsFloatingWidget'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Bot, MessageCircle, Zap, Mic, AlertTriangle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'

export const ConvAITestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ElevenLabs ConvAI Voice Integration
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Direct integration using the official ElevenLabs ConvAI widget SDK - VOICE MODE
          </p>
        </div>

        {/* Troubleshooting Alert */}
        <Alert className="max-w-4xl mx-auto mb-8 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800 dark:text-orange-200">
            Seeing Text Chat Instead of Voice?
          </AlertTitle>
          <AlertDescription className="text-orange-700 dark:text-orange-300">
            <div className="space-y-2 mt-2">
              <p><strong>Common fixes:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Check that your agent is configured for <strong>voice mode</strong> in ElevenLabs dashboard</li>
                <li>Grant <strong>microphone permissions</strong> when prompted by your browser</li>
                <li>Try the "Voice-Only Widget" tab below which forces voice mode</li>
                <li>Verify your agent has voice capabilities enabled</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-blue-500" />
                Voice First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Configured specifically for voice interaction, not text chat.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-500" />
                Multiple Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Try different widget configurations to find what works best.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                Troubleshooting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built-in error detection and voice mode verification.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-4xl mx-auto mb-8">
          <CardHeader>
            <CardTitle>Voice Widget Testing</CardTitle>
            <CardDescription>
              Try different configurations to enable voice mode
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="voice-only" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="voice-only">Voice-Only Widget</TabsTrigger>
                <TabsTrigger value="standard">Standard Widget</TabsTrigger>
                <TabsTrigger value="enhanced">Enhanced Widget</TabsTrigger>
              </TabsList>
              
              <TabsContent value="voice-only" className="mt-6">
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                      🎤 Voice-Only Configuration
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      This widget is configured to force voice mode and disable text chat.
                    </p>
                  </div>
                  <ElevenLabsVoiceWidget
                    agentId="agent_01jwq3qhggez2r9tafedrvvw0c"
                    onConversationStart={() => console.log('Voice-only conversation started')}
                    onConversationEnd={() => console.log('Voice-only conversation ended')}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="standard" className="mt-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      📱 Standard Widget with Voice Attributes
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Standard widget with voice mode attributes applied.
                    </p>
                  </div>
                  <ElevenLabsConvAI
                    agentId="agent_01jwq3qhggez2r9tafedrvvw0c"
                    onConversationStart={() => console.log('Standard conversation started')}
                    onConversationEnd={() => console.log('Standard conversation ended')}
                    style={{ 
                      minHeight: '400px',
                      border: '2px solid hsl(var(--border))',
                      borderRadius: '12px'
                    }}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="enhanced" className="mt-6">
                <div className="space-y-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                      ⚡ Enhanced Interface
                    </h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Custom interface with additional voice controls and feedback.
                    </p>
                  </div>
                  <div className="min-h-[400px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Enhanced interface coming soon...</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Troubleshooting Guide</CardTitle>
            <CardDescription>
              Steps to ensure voice mode is working properly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">🔧 If you see text chat instead of voice:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-1 mt-1">
                        <span className="text-blue-600 dark:text-blue-300 font-bold text-xs">1</span>
                      </div>
                      <div>
                        <h5 className="font-medium">Check Agent Settings</h5>
                        <p className="text-sm text-muted-foreground">
                          Verify your agent is configured for voice in ElevenLabs dashboard
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 dark:bg-green-900 rounded-full p-1 mt-1">
                        <span className="text-green-600 dark:text-green-300 font-bold text-xs">2</span>
                      </div>
                      <div>
                        <h5 className="font-medium">Grant Microphone Access</h5>
                        <p className="text-sm text-muted-foreground">
                          Click the microphone icon in your browser's address bar
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-1 mt-1">
                        <span className="text-purple-600 dark:text-purple-300 font-bold text-xs">3</span>
                      </div>
                      <div>
                        <h5 className="font-medium">Try Different Browsers</h5>
                        <p className="text-sm text-muted-foreground">
                          Chrome and Edge typically have better voice support
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-orange-100 dark:bg-orange-900 rounded-full p-1 mt-1">
                        <span className="text-orange-600 dark:text-orange-300 font-bold text-xs">4</span>
                      </div>
                      <div>
                        <h5 className="font-medium">Check Console Logs</h5>
                        <p className="text-sm text-muted-foreground">
                          Press F12 and look for voice-related errors
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm">
                <div className="text-gray-600 dark:text-gray-400 mb-2">Debug in Console (F12):</div>
                <pre className="text-gray-800 dark:text-gray-200">
{`// Check if voice is working
console.log('Microphone available:', navigator.mediaDevices.getUserMedia ? 'Yes' : 'No');

// Check widget status
document.querySelectorAll('elevenlabs-convai').forEach(widget => {
  console.log('Widget found:', widget);
  console.log('Voice mode:', widget.getAttribute('voice-mode'));
});`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Floating Widget Demo */}
        <ElevenLabsFloatingWidget />
        
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Agent ID: agent_01jwq3qhggez2r9tafedrvvw0c
          </p>
          <p className="text-xs text-muted-foreground">
            🎤 Voice mode should be enabled • Try the floating widget in the bottom-right corner!
          </p>
        </div>
      </div>
    </div>
  )
} 