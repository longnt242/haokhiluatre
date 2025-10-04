import type { Express } from "express";
import { createServer, type Server } from "http";
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import 'dotenv/config';

// Configure multer for file uploads (200MB limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Supabase client with service role key (server-side only)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("⚠️  Supabase environment variables not configured");
  }

  async function listBuckets() {
  const { data, error } = await supabase.storage.listBuckets()
  if (error) {
    console.error('Error listing buckets:', error)
    return false
  } else {
    console.log('Buckets:', data)
    return true
  }
}

  let supabase: any = null;
  if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Bootstrap: Create buckets if they don't exist
    try {
      const buckets = ['models', '2DImage', '3DImage', 'videos'];
      for (const bucketName of buckets) {
        const { data: bucket } = await supabase.storage.getBucket(bucketName);
        if (!bucket) {
          await supabase.storage.createBucket(bucketName, {
            public: true,
          });
          console.log(`✅ Created bucket: ${bucketName}`);
        }
      }
    } catch (error) {
      console.error("Error setting up buckets:", error);
    }
  }

  // Health check endpoint
  app.get('/api/health', async (req, res) => {
    if(await listBuckets()){
      res.json({ status: 'ok', message: 'Server is healthy and Supabase is connected.' });
    }
    else{
      res.status(503).json({ status: 'error', message: 'Supabase not configured. Please set environment variables.' });
    } 
  });

  // Get content from Supabase Storage buckets
  app.get('/api/content/:bucket', async (req, res) => {
    if (!supabase) {
      return res.status(503).json({ 
        message: 'Supabase not configured. Please set environment variables.' 
      });
    }
    console.log('Fetching content from bucket:', req.params.bucket);

    try {
      const { bucket } = req.params;
      const { data: files, error } = await supabase.storage
        .from(bucket)
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        return res.status(500).json({ message: error.message });
      }

      // Get public URLs and metadata for each file
      const filesWithUrls = files.map((file: any) => ({
        ...file,
        url: supabase.storage.from(bucket).getPublicUrl(file.name).data.publicUrl,
        metadata: {
          ...file.metadata,
          title: file.metadata?.title,
          description: file.metadata?.description
        }
      }));
      res.json(filesWithUrls);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch content' });
    }
  });

  // Upload endpoint with password protection
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!supabase) {
      return res.status(503).json({ 
        message: 'Supabase chưa được cấu hình. Vui lòng kiểm tra biến môi trường.' 
      });
    }

    try {
      const { kind, title, password } = req.body;
      const file = req.file;
      
      // Validate password
      if (password !== process.env.UPLOAD_PASSWORD) {
        return res.status(401).json({ message: 'Sai mật khẩu.' });
      }

      if (!file) {
        return res.status(400).json({ message: 'Không có file được tải lên.' });
      }

      // Validate file type based on kind
      const allowedTypes: Record<string, string[]> = {
        "2DImage": ['image/png', 'image/jpeg', 'image/jpg'],
        "3DImage": ['image/png', 'image/jpeg', 'image/jpg'],
        videos: ['video/mp4', 'video/webm'],
        models: ['model/gltf+json', 'model/gltf-binary', 'application/octet-stream'], // GLB files come as octet-stream
      };

      // For models, also check file extension since MIME type might not be accurate
      if (kind === 'models') {
        const isValidModel = allowedTypes.model.includes(file.mimetype) || 
                           file.originalname.toLowerCase().endsWith('.glb') || 
                           file.originalname.toLowerCase().endsWith('.gltf');
        if (!isValidModel) {
          return res.status(400).json({ message: 'Loại file model không hợp lệ. Chỉ hỗ trợ GLB và GLTF.' });
        }
      } else if (!allowedTypes[kind]?.includes(file.mimetype)) {
        return res.status(400).json({ message: 'Loại file không hợp lệ.' });
      }

      // Determine bucket
      const bucketMap: Record<string, string> = {
        "2DImage": '2DImage',
        "3DImage": '3DImage',
        videos: 'videos', 
        models: 'models',
      };
      const bucket = bucketMap[kind];

      // Generate unique filename
      const timestamp = Date.now();
      const extension = file.originalname.split('.').pop();
      const filename = `${timestamp}-${Math.random().toString(36).substr(2, 9)}.${extension}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filename, file.buffer, {
          contentType: file.mimetype,
          metadata: {
            title: title || file.originalname,
          },
        });

      if (error) {
        return res.status(500).json({ message: `Lỗi upload: ${error.message}` });
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filename);

      res.json({
        ok: true,
        kind,
        url: urlData.publicUrl,
        path: data.path,
        message: 'Upload thành công!',
      });

      console.log(res.json());

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Lỗi server khi upload file.' });
    }
  });

  // Update file metadata endpoint
  app.patch('/api/content/:bucket/:filename', async (req, res) => {
    if (!supabase) {
      return res.status(503).json({ 
        message: 'Supabase chưa được cấu hình. Vui lòng kiểm tra biến môi trường.' 
      });
    }``

    try {
      const { bucket, filename } = req.params;
      const { title, description, password } = req.body;

      // Validate password
      if (password !== process.env.UPLOAD_PASSWORD) {
        return res.status(401).json({ message: 'Sai mật khẩu.' });
      }

      // Get the existing file first
      const { data: fileData, error: downloadError } = await supabase.storage
        .from(bucket)
        .download(filename);

      if (downloadError) {
        return res.status(500).json({ message: `Lỗi tải file: ${downloadError.message}` });
      }

      // Re-upload with updated metadata
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filename, fileData, {
          upsert: true,
          metadata: {
            title: title || filename,
            description: description || '',
          },
        });

      if (error) {
        return res.status(500).json({ message: `Lỗi cập nhật: ${error.message}` });
      }

      res.json({
        ok: true,
        message: 'Cập nhật thành công!',
      });

    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ message: 'Lỗi server khi cập nhật file.' });
    }
  });

  // Delete file endpoint
  app.delete('/api/content/:bucket/:filename', async (req, res) => {
    if (!supabase) {
      return res.status(503).json({ 
        message: 'Supabase chưa được cấu hình. Vui lòng kiểm tra biến môi trường.' 
      });
    }

    try {
      const { bucket, filename } = req.params;
      const { password } = req.body;

      // Validate password
      if (password !== process.env.UPLOAD_PASSWORD) {
        return res.status(401).json({ message: 'Sai mật khẩu.' });
      }

      // Delete file from storage
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filename]);

      if (error) {
        return res.status(500).json({ message: `Lỗi xóa file: ${error.message}` });
      }

      res.json({
        ok: true,
        message: 'Xóa file thành công!',
      });

    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ message: 'Lỗi server khi xóa file.' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
