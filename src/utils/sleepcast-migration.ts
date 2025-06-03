import { sleepcastStorage } from '../lib/sleepcast-storage'

/**
 * Mapping of local public filenames to more user-friendly names
 */
export const SLEEPCAST_MAPPING = {
  'spiring-ocean-melodies.mp3': 'Ocean Melodies',
  'soft-piano-music.mp3': 'Soft Piano',
  'serene-meadow.mp3': 'Serene Meadow',
  'relaxing-handpan.mp3': 'Relaxing Handpan',
  'mountain-flowers.mp3': 'Mountain Flowers',
  'mini-sleep-cast.mp3': 'Mini Sleep Cast',
  'Meditation-Music.mp3': 'Meditation Music',
  'Rest Easy Tonight.png': 'Rest Easy Tonight',
  'Open Azleep Web App.png': 'Open Azleep Web App',
  'Chat with AI Sleep Genie.png': 'Chat with AI Sleep Genie'
} as const

/**
 * Get Supabase URL for a sleepcast file by filename
 */
export const getSleepcastUrl = async (filename: string): Promise<string | null> => {
  try {
    const files = await sleepcastStorage.listFiles()
    const file = files.find(f => f.name === filename)
    return file?.publicUrl || null
  } catch (error) {
    console.error('Error getting sleepcast URL:', error)
    return null
  }
}

/**
 * Get all available sleepcast files from Supabase Storage
 */
export const getAvailableSleepcastFiles = async () => {
  try {
    const files = await sleepcastStorage.listFiles()
    return files.filter(file => 
      file.contentType.startsWith('audio/') || 
      file.name.endsWith('.mp3') || 
      file.name.endsWith('.wav')
    ).map(file => ({
      ...file,
      displayName: SLEEPCAST_MAPPING[file.name as keyof typeof SLEEPCAST_MAPPING] || file.name
    }))
  } catch (error) {
    console.error('Error getting sleepcast files:', error)
    return []
  }
}

/**
 * Replace local public URLs with Supabase URLs in existing code
 * This is a helper for developers to migrate their existing sleepcast references
 */
export const migrateLocalUrlToSupabase = async (localPath: string): Promise<string> => {
  // Extract filename from local path (e.g., "/ocean-melodies.mp3" -> "ocean-melodies.mp3")
  const filename = localPath.replace(/^\/+/, '')
  
  const supabaseUrl = await getSleepcastUrl(filename)
  
  if (supabaseUrl) {
    return supabaseUrl
  } else {
    console.warn(`File not found in Supabase Storage: ${filename}`)
    return localPath // Fallback to original path
  }
}

/**
 * Preload commonly used sleepcast files for better performance
 */
export const preloadSleepcastFiles = async (): Promise<Record<string, string>> => {
  const files = await getAvailableSleepcastFiles()
  const urlMap: Record<string, string> = {}
  
  files.forEach(file => {
    urlMap[file.name] = file.publicUrl
  })
  
  return urlMap
} 