'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, X, File, Image, FileText, Download } from 'lucide-react'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '@/lib/firebase'

interface UploadedFile {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedAt: Date
}

interface FileUploadProps {
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
  maxSizeInMB?: number
  uploadPath: string
  label?: string
  description?: string
}

export function FileUpload({
  files,
  onFilesChange,
  maxFiles = 10,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx'],
  maxSizeInMB = 10,
  uploadPath,
  label = 'Upload Files',
  description = 'Drag and drop files here or click to browse'
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = async (fileList: File[]) => {
    if (files.length + fileList.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    setUploading(true)
    const newFiles: UploadedFile[] = []

    for (const file of fileList) {
      // Validate file size
      if (file.size > maxSizeInMB * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSizeInMB}MB`)
        continue
      }

      try {
        // Create unique filename
        const timestamp = Date.now()
        const fileName = `${timestamp}_${file.name}`
        const storageRef = ref(storage, `${uploadPath}/${fileName}`)

        // Upload file
        await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(storageRef)

        const uploadedFile: UploadedFile = {
          id: timestamp.toString(),
          name: file.name,
          url: downloadURL,
          type: file.type,
          size: file.size,
          uploadedAt: new Date()
        }

        newFiles.push(uploadedFile)
      } catch (error) {
        console.error('Error uploading file:', error)
        alert(`Failed to upload ${file.name}`)
      }
    }

    onFilesChange([...files, ...newFiles])
    setUploading(false)
  }

  const removeFile = async (fileToRemove: UploadedFile) => {
    try {
      // Delete from Firebase Storage
      const storageRef = ref(storage, fileToRemove.url)
      await deleteObject(storageRef)
      
      // Remove from state
      onFilesChange(files.filter(file => file.id !== fileToRemove.id))
    } catch (error) {
      console.error('Error deleting file:', error)
      // Still remove from state even if deletion fails
      onFilesChange(files.filter(file => file.id !== fileToRemove.id))
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />
    if (type === 'application/pdf') return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{label}</label>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${uploading ? 'opacity-50' : ''}`}
      >
        <CardContent className="p-6">
          <div
            className="text-center"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || files.length >= maxFiles}
              >
                {uploading ? 'Uploading...' : 'Choose Files'}
              </Button>
              <p className="text-sm text-gray-500">
                or drag and drop files here
              </p>
              <p className="text-xs text-gray-400">
                Max {maxFiles} files, {maxSizeInMB}MB each
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleChange}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files ({files.length})</h4>
          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(file)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
