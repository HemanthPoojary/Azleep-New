import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { supabase } from '../lib/supabase'

export const MigrationDebugger: React.FC = () => {
  const [debugResults, setDebugResults] = useState<string[]>([])
  const [debugging, setDebugging] = useState(false)

  const runDebugTests = async () => {
    setDebugging(true)
    const results: string[] = []
    
    try {
      results.push("🔍 Starting migration debug tests...")
      results.push("")

      // Test 1: Check if public files are accessible
      results.push("📁 Testing public file access...")
      const testFiles = [
        'spiring-ocean-melodies.mp3',
        'soft-piano-music.mp3', 
        'serene-meadow.mp3'
      ]

      for (const filename of testFiles) {
        try {
          const response = await fetch(`/${filename}`)
          if (response.ok) {
            const blob = await response.blob()
            results.push(`✅ ${filename} - accessible (${blob.size} bytes, ${blob.type})`)
          } else {
            results.push(`❌ ${filename} - HTTP ${response.status}: ${response.statusText}`)
          }
        } catch (error) {
          results.push(`❌ ${filename} - fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }

      results.push("")
      
      // Test 2: Test direct file upload
      results.push("📤 Testing direct file upload...")
      try {
        // Create a small test file
        const testContent = "This is a test file for migration debugging"
        const testFile = new File([testContent], 'debug-test.txt', { type: 'text/plain' })
        
        const filePath = `uploads/debug-${Date.now()}-test.txt`
        
        const { data, error } = await supabase.storage
          .from('sleepcast-files')
          .upload(filePath, testFile)
        
        if (error) {
          results.push(`❌ Upload failed: ${error.message}`)
        } else {
          results.push(`✅ Upload successful: ${data.path}`)
          
          // Test getting public URL
          const { data: { publicUrl } } = supabase.storage
            .from('sleepcast-files')
            .getPublicUrl(filePath)
          
          results.push(`✅ Public URL: ${publicUrl}`)
          
          // Clean up test file
          await supabase.storage
            .from('sleepcast-files')
            .remove([filePath])
          
          results.push(`✅ Test file cleaned up`)
        }
      } catch (error) {
        results.push(`❌ Upload test error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      results.push("")

      // Test 3: Test file listing
      results.push("📋 Testing file listing...")
      try {
        const { data: files, error } = await supabase.storage
          .from('sleepcast-files')
          .list('uploads', { limit: 100 })
        
        if (error) {
          results.push(`❌ Listing failed: ${error.message}`)
        } else {
          results.push(`✅ Listing successful: Found ${files.length} files`)
          if (files.length > 0) {
            files.forEach(file => {
              results.push(`  📄 ${file.name} (${file.metadata?.size || 'unknown'} bytes)`)
            })
          } else {
            results.push("  📂 No files found in uploads/ folder")
          }
        }
      } catch (error) {
        results.push(`❌ Listing error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      results.push("")

      // Test 4: Test manual single file migration
      results.push("🧪 Testing single file migration...")
      try {
        // Try to upload one file manually
        const filename = 'mini-sleep-cast.mp3' // Smallest file
        results.push(`📥 Attempting to fetch: /${filename}`)
        
        const response = await fetch(`/${filename}`)
        if (!response.ok) {
          results.push(`❌ Fetch failed: HTTP ${response.status}`)
        } else {
          const blob = await response.blob()
          results.push(`✅ Fetched successfully: ${blob.size} bytes, type: ${blob.type}`)
          
          const file = new File([blob], filename, { type: blob.type })
          const filePath = `uploads/debug-${Date.now()}-${filename}`
          
          results.push(`📤 Uploading to: ${filePath}`)
          
          const { data, error } = await supabase.storage
            .from('sleepcast-files')
            .upload(filePath, file)
          
          if (error) {
            results.push(`❌ Upload failed: ${error.message}`)
          } else {
            results.push(`✅ Upload successful!`)
            results.push(`✅ Path: ${data.path}`)
            
            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('sleepcast-files')
              .getPublicUrl(filePath)
            
            results.push(`✅ Public URL: ${publicUrl}`)
            
            // Test if we can list it
            const { data: listedFiles } = await supabase.storage
              .from('sleepcast-files')
              .list('uploads')
            
            const foundFile = listedFiles?.find(f => f.name === data.path.split('/').pop())
            if (foundFile) {
              results.push(`✅ File appears in listing: ${foundFile.name}`)
            } else {
              results.push(`⚠️  File not found in listing`)
            }
          }
        }
      } catch (error) {
        results.push(`❌ Single file migration error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      results.push("")
      results.push("🏁 Debug tests completed!")

    } catch (error) {
      results.push(`❌ Debug test error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    setDebugResults(results)
    setDebugging(false)
  }

  const clearResults = () => {
    setDebugResults([])
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🐛 Migration Debugger</CardTitle>
        <CardDescription>
          Debug the migration process to identify why files aren't appearing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runDebugTests} disabled={debugging}>
            {debugging ? 'Running Debug Tests...' : 'Run Debug Tests'}
          </Button>
          
          {debugResults.length > 0 && (
            <Button onClick={clearResults} variant="outline">
              Clear Results
            </Button>
          )}
        </div>
        
        {debugResults.length > 0 && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto">
            <h3 className="font-semibold">Debug Results:</h3>
            {debugResults.map((result, index) => (
              <div key={index} className="text-sm font-mono whitespace-pre-wrap">
                {result}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 