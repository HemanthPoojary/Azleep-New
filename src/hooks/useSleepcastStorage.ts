import { useState, useCallback } from 'react'
import { sleepcastStorage, SleepcastFile } from '../lib/sleepcast-storage'

export const useSleepcastStorage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<SleepcastFile[]>([])

  const clearError = useCallback(() => setError(null), [])

  const uploadFile = useCallback(async (file: File, filename?: string) => {
    setLoading(true)
    setError(null)
    try {
      const uploadedFile = await sleepcastStorage.uploadFile(file, filename)
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

  const uploadFromPublic = useCallback(async (filename: string) => {
    setLoading(true)
    setError(null)
    try {
      const uploadedFile = await sleepcastStorage.uploadFromPublic(filename)
      setFiles(prev => [...prev, uploadedFile])
      return uploadedFile
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file from public folder'
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
      const fileList = await sleepcastStorage.listFiles()
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
      await sleepcastStorage.deleteFile(filePath)
      setFiles(prev => prev.filter(file => file.path !== filePath))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const migratePublicFiles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const uploadedFiles = await sleepcastStorage.migratePublicFiles()
      setFiles(prev => [...prev, ...uploadedFiles])
      return uploadedFiles
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to migrate public files'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getPublicUrl = useCallback((filePath: string) => {
    return sleepcastStorage.getPublicUrl(filePath)
  }, [])

  return {
    loading,
    error,
    files,
    clearError,
    uploadFile,
    uploadFromPublic,
    listFiles,
    deleteFile,
    migratePublicFiles,
    getPublicUrl
  }
} 