import React, { useEffect, useState } from 'react'
import { useSleepcastStorage } from '../hooks/useSleepcastStorage'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { Upload, Download, Trash2, RefreshCw, Music, Image, CheckCircle, AlertCircle } from 'lucide-react'

export const SleepcastManager: React.FC = () => {
  const {
    loading,
    error,
    files,
    clearError,
    listFiles,
    deleteFile,
    migratePublicFiles,
    getPublicUrl
  } = useSleepcastStorage()

  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'migrating' | 'completed' | 'error'>('idle')

  useEffect(() => {
    listFiles()
  }, [listFiles])

  const handleMigration = async () => {
    setMigrationStatus('migrating')
    try {
      await migratePublicFiles()
      setMigrationStatus('completed')
      // Refresh the file list
      await listFiles()
    } catch (err) {
      setMigrationStatus('error')
      console.error('Migration failed:', err)
    }
  }

  const handleDelete = async (filePath: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      try {
        await deleteFile(filePath)
      } catch (err) {
        console.error('Failed to delete file:', err)
      }
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('audio/')) {
      return <Music className="h-4 w-4" />
    } else if (contentType.startsWith('image/')) {
      return <Image className="h-4 w-4" />
    }
    return <Upload className="h-4 w-4" />
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Sleepcast Storage Manager
          </CardTitle>
          <CardDescription>
            Manage your ElevenLabs sleepcast files in Supabase Storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <Button variant="outline" size="sm" className="ml-2" onClick={clearError}>
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Migration Section */}
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold">Migrate Public Files</h3>
            <p className="text-sm text-muted-foreground">
              Upload all sleepcast files from your public folder to Supabase Storage.
            </p>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={handleMigration}
                disabled={loading || migrationStatus === 'migrating'}
                className="flex items-center gap-2"
              >
                {migrationStatus === 'migrating' ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {migrationStatus === 'migrating' ? 'Migrating...' : 'Migrate Public Files'}
              </Button>

              {migrationStatus === 'completed' && (
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Migration Completed
                </Badge>
              )}

              {migrationStatus === 'error' && (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Migration Failed
                </Badge>
              )}
            </div>
          </div>

          {/* File List Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Stored Files ({files.length})</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={listFiles}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {loading && files.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                Loading files...
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No files found. Use the migration button above to upload your sleepcast files.
              </div>
            ) : (
              <div className="grid gap-4">
                {files.map((file) => (
                  <Card key={file.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.contentType)}
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(file.publicUrl, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(file.path)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 