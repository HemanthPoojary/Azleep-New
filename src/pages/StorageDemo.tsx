import React from 'react'
import { SleepcastManager } from '../components/SleepcastManager'
import { SupabaseConnectionTest } from '../components/SupabaseConnectionTest'
import { MigrationDebugger } from '../components/MigrationDebugger'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Code, Database, Upload } from 'lucide-react'

export const StorageDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Supabase Storage Integration
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your ElevenLabs sleepcast files are now managed through Supabase Storage with GCP backend
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                Supabase Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Files are stored securely in Supabase Storage with GCP backend for high availability and performance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-green-500" />
                Easy Migration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                One-click migration from your public folder to cloud storage with automatic URL generation.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-500" />
                Developer Friendly
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                TypeScript-first API with React hooks for easy integration into your application.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <SupabaseConnectionTest />
        </div>

        <div className="mb-8">
          <MigrationDebugger />
        </div>

        <SleepcastManager />

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Usage in Your App</CardTitle>
            <CardDescription>
              Here's how to use the Supabase storage in your components:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`import { useSleepcastStorage } from '../hooks/useSleepcastStorage'

export const MyComponent = () => {
  const { files, listFiles, getPublicUrl } = useSleepcastStorage()
  
  useEffect(() => {
    listFiles() // Load files from Supabase Storage
  }, [])
  
  return (
    <div>
      {files.map(file => (
        <audio key={file.id} controls>
          <source src={file.publicUrl} type="audio/mpeg" />
        </audio>
      ))}
    </div>
  )
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 