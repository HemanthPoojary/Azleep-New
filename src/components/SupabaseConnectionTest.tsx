import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { supabase } from '../lib/supabase'
import { supabaseSetup } from '../lib/supabase-setup'

export const SupabaseConnectionTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([])
  const [testing, setTesting] = useState(false)
  const [setupResults, setSetupResults] = useState<string[]>([])
  const [settingUp, setSettingUp] = useState(false)

  const runTests = async () => {
    setTesting(true)
    const results: string[] = []
    
    try {
      // Test 1: Basic Supabase connection
      results.push("🔍 Testing Supabase connection...")
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      if (bucketsError) {
        results.push(`❌ Connection failed: ${bucketsError.message}`)
      } else {
        results.push(`✅ Connection successful! Found ${buckets.length} buckets`)
        results.push(`📦 Buckets: ${buckets.map(b => b.name).join(', ') || 'None'}`)
      }

      // Test 2: Check if sleepcast-files bucket exists
      const sleepcastBucket = buckets?.find(b => b.name === 'sleepcast-files')
      if (sleepcastBucket) {
        results.push(`✅ sleepcast-files bucket exists`)
        
        // Test 3: Try to list files in the bucket
        results.push("🔍 Checking files in sleepcast-files bucket...")
        const { data: files, error: filesError } = await supabase.storage
          .from('sleepcast-files')
          .list('uploads', { limit: 100 })
        
        if (filesError) {
          results.push(`❌ File listing failed: ${filesError.message}`)
          results.push("🔐 This usually means storage policies are missing")
          results.push("👆 Click 'Setup Storage' to get configuration instructions")
        } else {
          results.push(`✅ File listing successful! Found ${files.length} files`)
          if (files.length > 0) {
            files.forEach(file => {
              results.push(`📄 File: ${file.name} (${file.metadata?.size || 'unknown size'})`)
            })
          } else {
            results.push("📂 No files in storage yet - ready for migration!")
          }
        }
      } else {
        results.push(`❌ sleepcast-files bucket not found`)
        results.push("👆 Click 'Setup Storage' to get bucket creation instructions")
      }

      // Test 4: Check environment variables
      results.push("🔍 Checking environment variables...")
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (supabaseUrl) {
        results.push(`✅ VITE_SUPABASE_URL: ${supabaseUrl}`)
      } else {
        results.push(`❌ VITE_SUPABASE_URL is missing`)
      }
      
      if (supabaseKey) {
        results.push(`✅ VITE_SUPABASE_ANON_KEY: ${supabaseKey.substring(0, 20)}...`)
      } else {
        results.push(`❌ VITE_SUPABASE_ANON_KEY is missing`)
      }

    } catch (error) {
      results.push(`❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    setTestResults(results)
    setTesting(false)
  }

  const runSetup = async () => {
    setSettingUp(true)
    const { success, messages } = await supabaseSetup.setupStorage()
    
    // Always show the complete setup instructions
    const completeInstructions = supabaseSetup.getCompleteSetupInstructions()
    setSetupResults([...messages, "", ...completeInstructions])
    
    setSettingUp(false)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🔧 Supabase Connection Test & Setup</CardTitle>
        <CardDescription>
          Test the connection to Supabase and get setup instructions for storage bucket and permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runTests} disabled={testing || settingUp}>
            {testing ? 'Running Tests...' : 'Run Connection Test'}
          </Button>
          
          <Button onClick={runSetup} disabled={testing || settingUp} variant="outline">
            {settingUp ? 'Getting Instructions...' : 'Setup Storage'}
          </Button>
        </div>
        
        {testResults.length > 0 && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold">Test Results:</h3>
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        )}

        {setupResults.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold">Setup Instructions:</h3>
            {setupResults.map((result, index) => (
              <div key={index} className="text-sm font-mono whitespace-pre-wrap">
                {result}
              </div>
            ))}
          </div>
        )}
        
        {setupResults.length > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              🎯 Quick Action Items:
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-green-700 dark:text-green-300">
              <li>Go to your <a href="https://supabase.com/dashboard/project/wcthawnaarzizbfmzgqg" target="_blank" rel="noopener noreferrer" className="underline">Supabase Dashboard</a></li>
              <li>Create the "sleepcast-files" bucket in Storage → Buckets</li>
              <li>Set up 4 storage policies in Storage → Policies</li>
              <li>Come back and click "Run Connection Test" to verify</li>
              <li>Then use "Migrate Public Files" to upload your sleepcast files</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 