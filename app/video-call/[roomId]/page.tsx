'use client'

import { VideoCall } from '@/components/video/VideoCall'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import RequireAuth from '@/components/auth/RequireAuth'

export default function VideoCallPage() {
  const params = useParams()
  const router = useRouter()
  const { profile } = useAuth()
  
  const roomId = params.roomId as string
  const participantName = profile?.displayName || 'Anonymous User'

  const handleEndCall = () => {
    router.push('/dashboard')
  }

  const handleToggleVideo = (enabled: boolean) => {
    console.log('Video toggled:', enabled)
    // WebRTC implementation would go here
  }

  const handleToggleMic = (enabled: boolean) => {
    console.log('Microphone toggled:', enabled)
    // WebRTC implementation would go here
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-900">
        <VideoCall
          roomId={roomId}
          participantName={participantName}
          onEndCall={handleEndCall}
          onToggleVideo={handleToggleVideo}
          onToggleMic={handleToggleMic}
        />
      </div>
    </RequireAuth>
  )
}
