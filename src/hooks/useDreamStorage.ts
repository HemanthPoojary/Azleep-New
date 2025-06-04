import { useState, useCallback } from 'react'
import { dreamStorage, DreamFile } from '@/lib/dream-storage'

export const useDreamStorage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<DreamFile[]>([])

  const clearError = useCallback(() => setError(null), [])

  const uploadFile = useCallback(async (file: File, filename?: string) => {
    setLoading(true)
    setError(null)
    try {
      const uploadedFile = await dreamStorage.uploadFile(file, filename)
      setFiles(prev => [...prev, uploadedFile])
      return uploadedFile
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const listFiles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const fileList = await dreamStorage.listFiles()
      setFiles(fileList)
      return fileList
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list files'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteFile = useCallback(async (filePath: string) => {
    setLoading(true)
    setError(null)
    try {
      await dreamStorage.deleteFile(filePath)
      setFiles(prev => prev.filter(file => file.path !== filePath))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getPublicUrl = useCallback((filePath: string) => {
    return dreamStorage.getPublicUrl(filePath)
  }, [])

  return {
    loading,
    error,
    files,
    clearError,
    uploadFile,
    listFiles,
    deleteFile,
    getPublicUrl
  }
} 