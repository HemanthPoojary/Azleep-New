import { supabase } from './supabase'

export class SupabaseSetup {
  
  /**
   * Complete setup of Supabase storage with all required permissions
   */
  async setupStorage(): Promise<{ success: boolean; messages: string[] }> {
    const messages: string[] = []
    
    try {
      messages.push("🚀 Starting Supabase storage setup...")
      
      // Step 1: Check if bucket exists first
      const bucketExists = await this.checkBucketExists(messages)
      
      if (!bucketExists) {
        // Try to create bucket, but handle permission errors gracefully
        await this.attemptCreateBucket(messages)
      }
      
      // Step 2: Verify setup and provide instructions
      await this.verifySetup(messages)
      
      return { success: true, messages }
      
    } catch (error) {
      messages.push(`❌ Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return { success: false, messages }
    }
  }
  
  /**
   * Check if bucket exists
   */
  private async checkBucketExists(messages: string[]): Promise<boolean> {
    messages.push("🔍 Checking if sleepcast-files bucket exists...")
    
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.name === 'sleepcast-files')
    
    if (bucketExists) {
      messages.push("✅ sleepcast-files bucket already exists")
      return true
    } else {
      messages.push("❌ sleepcast-files bucket not found")
      return false
    }
  }
  
  /**
   * Attempt to create bucket, handle permission errors gracefully
   */
  private async attemptCreateBucket(messages: string[]) {
    messages.push("📦 Attempting to create sleepcast-files bucket...")
    
    try {
      const { error } = await supabase.storage.createBucket('sleepcast-files', {
        public: true,
        allowedMimeTypes: [
          'audio/mpeg', 
          'audio/wav', 
          'audio/mp3', 
          'image/png', 
          'image/jpeg', 
          'text/plain'
        ],
        fileSizeLimit: 50 * 1024 * 1024 // 50MB
      })
      
      if (error) {
        if (error.message.includes('row-level security policy') || error.message.includes('permission')) {
          messages.push("⚠️  Cannot create bucket with anon key (this is normal)")
          messages.push("📋 You'll need to create the bucket manually in Supabase Dashboard")
        } else {
          messages.push(`❌ Failed to create bucket: ${error.message}`)
        }
      } else {
        messages.push("✅ Bucket created successfully")
      }
    } catch (error) {
      messages.push("⚠️  Bucket creation requires elevated permissions")
      messages.push("📋 Please create the bucket manually in Supabase Dashboard")
    }
  }
  
  /**
   * Verify the setup is working
   */
  private async verifySetup(messages: string[]) {
    messages.push("🔍 Verifying current setup...")
    
    // Test bucket access
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    if (bucketsError) {
      throw new Error(`Cannot access buckets: ${bucketsError.message}`)
    }
    
    const bucket = buckets?.find(b => b.name === 'sleepcast-files')
    if (!bucket) {
      messages.push("❌ sleepcast-files bucket still not found")
      messages.push("📋 Manual bucket creation required (see instructions below)")
      return
    }
    
    messages.push("✅ Bucket access verified")
    
    // Test file listing
    const { error: listError } = await supabase.storage
      .from('sleepcast-files')
      .list('uploads')
    
    if (listError) {
      messages.push(`⚠️  File listing test: ${listError.message}`)
      messages.push("🔐 Storage policies need to be configured (see instructions below)")
    } else {
      messages.push("✅ File listing access verified - storage is ready!")
    }
  }
  
  /**
   * Get complete setup instructions
   */
  getCompleteSetupInstructions(): string[] {
    return [
      "🔧 Complete Manual Setup Instructions:",
      "",
      "STEP 1: Create Storage Bucket",
      "1. Go to: https://supabase.com/dashboard/project/wcthawnaarzizbfmzgqg",
      "2. Navigate to: Storage → Buckets",
      "3. Click 'Create Bucket'",
      "4. Bucket name: sleepcast-files",
      "5. Make it public: ✅ Public bucket",
      "6. Click 'Create bucket'",
      "",
      "STEP 2: Configure Storage Policies",
      "1. Still in Storage, go to: Policies tab",
      "2. Click 'New Policy' 4 times to create these policies:",
      "",
      "Policy 1: Public Read Access",
      "- Policy name: Public Access",
      "- Allowed operation: SELECT",
      "- Target roles: public",
      "- USING expression: bucket_id = 'sleepcast-files'",
      "",
      "Policy 2: Public Upload Access", 
      "- Policy name: Public Upload",
      "- Allowed operation: INSERT",
      "- Target roles: public",
      "- WITH CHECK expression: bucket_id = 'sleepcast-files'",
      "",
      "Policy 3: Public Update Access",
      "- Policy name: Public Update", 
      "- Allowed operation: UPDATE",
      "- Target roles: public",
      "- USING expression: bucket_id = 'sleepcast-files'",
      "",
      "Policy 4: Public Delete Access",
      "- Policy name: Public Delete",
      "- Allowed operation: DELETE", 
      "- Target roles: public",
      "- USING expression: bucket_id = 'sleepcast-files'",
      "",
      "STEP 3: Alternative SQL Method",
      "If you prefer SQL, go to SQL Editor and run:",
      "",
      "-- Create bucket (if using SQL)",
      "INSERT INTO storage.buckets (id, name, public) VALUES ('sleepcast-files', 'sleepcast-files', true);",
      "",
      "-- Create policies",
      'CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = \'sleepcast-files\');',
      'CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = \'sleepcast-files\');',
      'CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = \'sleepcast-files\');',
      'CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = \'sleepcast-files\');',
      "",
      "STEP 4: Test the Setup",
      "After completing the above, click 'Run Connection Test' to verify everything works!"
    ]
  }
  
  /**
   * Legacy method - keeping for compatibility
   */
  getManualSetupInstructions(): string[] {
    return this.getCompleteSetupInstructions()
  }
}

export const supabaseSetup = new SupabaseSetup() 