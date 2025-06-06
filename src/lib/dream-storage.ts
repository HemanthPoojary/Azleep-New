import { supabase } from '@/integrations/supabase/client'

export interface DreamFile {
  id: string
  name: string
  path: string
  size: number
  contentType: string
  createdAt: string
  publicUrl: string
}

export class DreamStorage {
  private bucketName = 'dream-narratives'

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(file: File, filename?: string): Promise<DreamFile> {
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
   * List all dream narrative files in storage
   */
  async listFiles(): Promise<DreamFile[]> {
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
}

export const dreamStorage = new DreamStorage() 