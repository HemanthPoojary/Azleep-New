# Supabase Storage Setup for ElevenLabs Sleepcast Files

This project now uses Supabase Storage (with GCP backend) to manage your ElevenLabs sleepcast audio files and related assets.

## 🚀 Quick Start

1. **Access the Storage Manager**
   - Navigate to `/app/storage` in your application
   - Use the Storage Manager interface to migrate and manage files

2. **Migrate Your Files**
   - Click "Migrate Public Files" to upload all files from the `public/` folder to Supabase Storage
   - Files will be automatically organized and given public URLs

## 📁 File Structure

### Supabase Storage Bucket: `sleepcast-files`
- **Location**: `uploads/` directory
- **Access**: Public read access with secure URLs
- **Supported formats**: MP3, WAV, PNG, JPEG, TXT

### Files included in migration:
- `spiring-ocean-melodies.mp3` → Ocean Melodies
- `soft-piano-music.mp3` → Soft Piano
- `serene-meadow.mp3` → Serene Meadow
- `relaxing-handpan.mp3` → Relaxing Handpan
- `mountain-flowers.mp3` → Mountain Flowers
- `mini-sleep-cast.mp3` → Mini Sleep Cast
- `Meditation-Music.mp3` → Meditation Music
- Plus image assets and other files

## 🔧 Environment Variables

```bash
VITE_SUPABASE_URL=https://wcthawnaarzizbfmzgqg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjdGhhd25hYXJ6aXpiZm16Z3FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDEzNTEsImV4cCI6MjA2NDM3NzM1MX0.4O8OBEuren7j0B4Zw1vIIEi8tLsbfq9rfOC3DC_D2cU
```

## 💻 Using in Your Code

### Basic Usage with React Hook

```typescript
import { useSleepcastStorage } from '../hooks/useSleepcastStorage'

export const AudioPlayer = () => {
  const { files, listFiles, loading, error } = useSleepcastStorage()
  
  useEffect(() => {
    listFiles()
  }, [listFiles])
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      {files.map(file => (
        <audio key={file.id} controls>
          <source src={file.publicUrl} type="audio/mpeg" />
          {file.name}
        </audio>
      ))}
    </div>
  )
}
```

### Direct Storage Access

```typescript
import { sleepcastStorage } from '../lib/sleepcast-storage'

// Upload a new file
const file = new File([blob], 'new-sleepcast.mp3')
const uploadedFile = await sleepcastStorage.uploadFile(file)

// List all files
const files = await sleepcastStorage.listFiles()

// Get public URL
const url = sleepcastStorage.getPublicUrl('uploads/filename.mp3')
```

### Migration Utilities

```typescript
import { 
  getSleepcastUrl, 
  getAvailableSleepcastFiles,
  migrateLocalUrlToSupabase 
} from '../utils/sleepcast-migration'

// Get Supabase URL for a specific file
const url = await getSleepcastUrl('ocean-melodies.mp3')

// Get all audio files with display names
const audioFiles = await getAvailableSleepcastFiles()

// Migrate existing local URLs
const newUrl = await migrateLocalUrlToSupabase('/ocean-melodies.mp3')
```

## 🔒 Security & Performance

- **Public Access**: Files are publicly accessible via secure URLs
- **CDN**: Served through Supabase's CDN for fast global delivery
- **GCP Backend**: Files stored on Google Cloud Platform for reliability
- **File Size Limit**: 50MB per file
- **Allowed Types**: Audio files (MP3, WAV), Images (PNG, JPEG), Text files

## 📊 Storage Management

Access the storage management interface at `/app/storage` to:

- ✅ Migrate files from public folder
- 📋 View all stored files with metadata
- 🗑️ Delete unwanted files
- 🔗 Get public URLs for files
- 📈 Monitor storage usage

## 🚨 Important Notes

1. **Migration**: Run the migration once to move files from public folder to Supabase
2. **URLs**: Update your existing code to use Supabase URLs instead of local paths
3. **Backup**: Original files remain in the public folder as backup
4. **Performance**: Files are served from CDN for optimal loading times

## 🔧 Troubleshooting

### Files not appearing after migration?
- Check browser console for errors
- Verify environment variables are set correctly
- Ensure Supabase project permissions allow storage access

### Can't upload files?
- Check file size (max 50MB)
- Verify file type is allowed
- Check network connectivity

### Getting CORS errors?
- Ensure Supabase project has correct CORS settings
- Verify the anon key has proper permissions

## 📚 API Reference

See the TypeScript definitions in:
- `src/lib/sleepcast-storage.ts` - Core storage functionality
- `src/hooks/useSleepcastStorage.ts` - React hook
- `src/utils/sleepcast-migration.ts` - Migration utilities 