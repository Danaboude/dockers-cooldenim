'use client';
import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { CloudArrowUp, X, Spinner } from '@phosphor-icons/react';

export interface UploadedImage {
  url: string;
  display: string;
  thumb: string;
}

interface Props {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

async function compressImage(file: File, maxPx = 1920, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxPx || height > maxPx) {
          if (width > height) {
            height = Math.round((height * maxPx) / width);
            width = maxPx;
          } else {
            width = Math.round((width * maxPx) / height);
            height = maxPx;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', quality).split(',')[1];
        resolve(base64);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUpload({ images, onChange, maxImages = 8 }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (images.length >= maxImages) return;

    setUploading(true);
    const newImages: UploadedImage[] = [];
    const allowed = Math.min(files.length, maxImages - images.length);

    for (let i = 0; i < allowed; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      try {
        const base64 = await compressImage(file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, name: file.name }),
        });
        const data = await res.json();
        if (data.success) {
          newImages.push({
            url: data.data.url,
            display: data.data.display_url || data.data.url,
            thumb: data.data.thumb?.url || data.data.url,
          });
        }
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }

    onChange([...images, ...newImages]);
    setUploading(false);
  }, [images, onChange, maxImages]);

  const removeImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files); }}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-gold bg-gold/5'
            : 'border-border hover:border-navy/40 hover:bg-off-white'
        } ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => uploadFiles(e.target.files)}
          disabled={uploading || images.length >= maxImages}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Spinner size={28} className="text-navy animate-spin" />
            <p className="text-sm text-muted">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <CloudArrowUp size={32} className="text-navy/40" />
            <p className="text-sm font-medium text-navy">Drop images here or click to browse</p>
            <p className="text-xs text-muted">JPEG, PNG, WebP - Max {maxImages} images. Auto-compressed.</p>
          </div>
        )}
      </div>

      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-off-white group">
              <Image
                src={img.thumb || img.url}
                alt={`Image ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} weight="bold" className="text-white" />
              </button>
              {i === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-navy/70 text-white text-[9px] text-center py-0.5">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
