import { supabase } from './supabase'

export interface SleepcastFile {
  id: string
  name: string
  path: string
  size: number
  contentType: string
  createdAt: string
  publicUrl: string
}

export class SleepcastStorage {
  private bucketName = 'sleepcast-files'

  /**
   * Initialize the storage bucket for sleepcast files
   */
  async initializeBucket() {
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.name === this.bucketName)

    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(this.bucketName, {
        public: true,
        allowedMimeTypes: ['audio/mpeg', 'audio/wav', 'audio/mp3', 'image/png', 'image/jpeg', 'text/plain'],
        fileSizeLimit: 50 * 1024 * 1024 // 50MB limit
      })

      if (error) {
        console.error('Error creating bucket:', error)
        throw error
      }
    }
  }

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(file: File, filename?: string): Promise<SleepcastFile> {
    await this.initializeBucket()

    const fileName = filename || file.name
    const filePath = `uploads/${Date.now()}-${fileName}`

    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading file:', error)
      throw error
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath)

    return {
      id: data.id || filePath,
      name: fileName,
      path: filePath,
      size: file.size,
      contentType: file.type,
      createdAt: new Date().toISOString(),
      publicUrl
    }
  }

  /**
   * Upload a file from the public folder to Supabase Storage
   */
  async uploadFromPublic(filename: string): Promise<SleepcastFile> {
    try {
      // Fetch the file from the public folder
      const response = await fetch(`/${filename}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.statusText}`)
      }

      const blob = await response.blob()
      const file = new File([blob], filename, { type: blob.type })
      
      return await this.uploadFile(file, filename)
    } catch (error) {
      console.error(`Error uploading ${filename} from public folder:`, error)
      throw error
    }
  }

  /**
   * List all sleepcast files in storage
   */
  async listFiles(): Promise<SleepcastFile[]> {
    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .list('uploads', {
        limit: 100,
        offset: 0
      })

    if (error) {
      console.error('Error listing files:', error)
      throw error
    }

    return data?.map(file => {
      const { data: { publicUrl } } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(`uploads/${file.name}`)

      return {
        id: file.id || file.name,
        name: file.name,
        path: `uploads/${file.name}`,
        size: file.metadata?.size || 0,
        contentType: file.metadata?.mimetype || '',
        createdAt: file.created_at || new Date().toISOString(),
        publicUrl
      }
    }) || []
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([filePath])

    if (error) {
      console.error('Error deleting file:', error)
      throw error
    }
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(filePath: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath)
    
    return publicUrl
  }

  /**
   * Migrate all files from public folder to Supabase Storage
   */
  async migratePublicFiles(): Promise<SleepcastFile[]> {
    const publicFiles = [
      'spiring-ocean-melodies.mp3',
      'soft-piano-music.mp3',
      'serene-meadow.mp3',
      'relaxing-handpan.mp3',
      'mountain-flowers.mp3',
      'mini-sleep-cast.mp3',
      'Rest Easy Tonight.png',
      'Open Azleep Web App.png',
      'Meditation-Music.mp3',
      'Chat with AI Sleep Genie.png'
    ]

    const uploadedFiles: SleepcastFile[] = []

    for (const filename of publicFiles) {
      try {
        console.log(`Uploading ${filename}...`)
        const uploadedFile = await this.uploadFromPublic(filename)
        uploadedFiles.push(uploadedFile)
        console.log(`✓ Successfully uploaded ${filename}`)
      } catch (error) {
        console.error(`✗ Failed to upload ${filename}:`, error)
      }
    }

    return uploadedFiles
  }
}

// Export singleton instance
export const sleepcastStorage = new SleepcastStorage() 