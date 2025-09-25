'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Settings, 
  Users,
  MessageSquare,
  Share2,
  MoreVertical
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoCallProps {
  roomId: string
  participantName: string
  isHost?: boolean
  onEndCall?: () => void
  onToggleVideo?: (enabled: boolean) => void
  onToggleMic?: (enabled: boolean) => void
}

interface Participant {
  id: string
  name: string
  isVideoEnabled: boolean
  isMicEnabled: boolean
  isHost: boolean
}

export function VideoCall({
  roomId,
  participantName,
  isHost = false,
  onEndCall,
  onToggleVideo,
  onToggleMic
}: VideoCallProps) {
  const [isVideoEnabled, setIsVideoEnabled] = React.useState(true)
  const [isMicEnabled, setIsMicEnabled] = React.useState(true)
  const [isCallActive, setIsCallActive] = React.useState(false)
  const [participants, setParticipants] = React.useState<Participant[]>([
    {
      id: '1',
      name: participantName,
      isVideoEnabled: true,
      isMicEnabled: true,
      isHost: isHost
    }
  ])
  const [showSettings, setShowSettings] = React.useState(false)
  const [callDuration, setCallDuration] = React.useState(0)

  const videoRef = React.useRef<HTMLVideoElement>(null)
  const remoteVideoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isCallActive])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleToggleVideo = () => {
    const newState = !isVideoEnabled
    setIsVideoEnabled(newState)
    onToggleVideo?.(newState)
  }

  const handleToggleMic = () => {
    const newState = !isMicEnabled
    setIsMicEnabled(newState)
    onToggleMic?.(newState)
  }

  const handleStartCall = async () => {
    try {
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      setIsCallActive(true)
    } catch (error) {
      console.error('Error accessing media devices:', error)
    }
  }

  const handleEndCall = () => {
    setIsCallActive(false)
    setCallDuration(0)
    
    // Stop all tracks
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
    
    onEndCall?.()
  }

  if (!isCallActive) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Video Call</CardTitle>
          <CardDescription>
            Room ID: <Badge variant="secondary">{roomId}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-4">
              <Video className="h-16 w-16 text-gray-400 mx-auto" />
              <p className="text-gray-600">Ready to start your video call?</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button onClick={handleStartCall} size="lg" className="px-8">
              <Video className="mr-2 h-5 w-5" />
              Start Call
            </Button>
            <Button variant="outline" size="lg" onClick={onEndCall}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Video Call</h2>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {formatDuration(callDuration)}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Users className="h-4 w-4 mr-2" />
            {participants.length}
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video (Main) */}
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />
        
        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-64 h-48 bg-gray-900 rounded-lg overflow-hidden border-2 border-white/20">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <VideoOff className="h-8 w-8 text-white" />
            </div>
          )}
        </div>

        {/* Participant Info */}
        <div className="absolute bottom-20 left-4 right-4">
          <div className="flex flex-wrap gap-2">
            {participants.map((participant) => (
              <Badge
                key={participant.id}
                variant="secondary"
                className="bg-black/60 text-white backdrop-blur"
              >
                {participant.name}
                {participant.isHost && ' (Host)'}
                {!participant.isMicEnabled && <MicOff className="ml-1 h-3 w-3" />}
                {!participant.isVideoEnabled && <VideoOff className="ml-1 h-3 w-3" />}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black/80 backdrop-blur p-6">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={isMicEnabled ? "secondary" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={handleToggleMic}
          >
            {isMicEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </Button>
          
          <Button
            variant={isVideoEnabled ? "secondary" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={handleToggleVideo}
          >
            {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>
          
          <Button
            variant="destructive"
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            className="rounded-full w-14 h-14"
          >
            <MoreVertical className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 w-80 bg-white rounded-lg shadow-xl border p-4 z-10">
          <h3 className="font-semibold mb-4">Call Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Camera</label>
              <select className="w-full mt-1 p-2 border rounded">
                <option>Default Camera</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Microphone</label>
              <select className="w-full mt-1 p-2 border rounded">
                <option>Default Microphone</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Speaker</label>
              <select className="w-full mt-1 p-2 border rounded">
                <option>Default Speaker</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
