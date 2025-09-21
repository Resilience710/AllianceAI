'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, doc, getDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bot, Send, Search, MoreVertical, Phone, Video, Paperclip, ArrowLeft } from 'lucide-react'
import RequireAuth from '@/components/auth/RequireAuth'
import { useAuth } from '@/components/auth/AuthProvider'
import { db } from '@/lib/firebase'

// Mock conversation data
const mockConversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "TechCorp Inc.",
    avatar: "/api/placeholder/40/40",
    lastMessage: "Thanks for the proposal. When can we schedule a call?",
    timestamp: "2 min ago",
    unread: 2,
    online: true
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "DataFlow Systems",
    avatar: "/api/placeholder/40/40",
    lastMessage: "The AI automation looks perfect for our needs.",
    timestamp: "1 hour ago",
    unread: 0,
    online: false
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    company: "InnovateLabs",
    avatar: "/api/placeholder/40/40",
    lastMessage: "Can you provide more details about the pricing?",
    timestamp: "3 hours ago",
    unread: 1,
    online: true
  },
  {
    id: 4,
    name: "David Kim",
    company: "StartupXYZ",
    avatar: "/api/placeholder/40/40",
    lastMessage: "Great! Let's move forward with the project.",
    timestamp: "Yesterday",
    unread: 0,
    online: false
  }
]

const mockMessages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    content: "Hi! I'm interested in your Custom AI Agent Development service. Can you tell me more about the process?",
    timestamp: "10:30 AM",
    isOwn: false
  },
  {
    id: 2,
    sender: "You",
    content: "Hello Sarah! Thanks for your interest. Our custom AI agent development process typically involves 4 phases: Discovery & Requirements, Design & Architecture, Development & Testing, and Deployment & Training. The entire process usually takes 2-4 weeks depending on complexity.",
    timestamp: "10:35 AM",
    isOwn: true
  },
  {
    id: 3,
    sender: "Sarah Johnson",
    content: "That sounds great! What kind of integrations do you support? We use Salesforce and Slack primarily.",
    timestamp: "10:40 AM",
    isOwn: false
  },
  {
    id: 4,
    sender: "You",
    content: "Perfect! We have extensive experience with both Salesforce and Slack integrations. We can create AI agents that work seamlessly with your existing workflow. I can prepare a detailed proposal for you. Would you like to schedule a call to discuss your specific requirements?",
    timestamp: "10:45 AM",
    isOwn: true
  },
  {
    id: 5,
    sender: "Sarah Johnson",
    content: "Thanks for the proposal. When can we schedule a call?",
    timestamp: "11:20 AM",
    isOwn: false
  }
]

interface Conversation {
  id: string
  participants: string[]
  lastMessage?: string
  lastMessageTime?: any
  unreadCount?: number
  otherParticipant?: {
    uid: string
    displayName: string
    email: string
    company?: string
    role: string
  }
}

interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  timestamp: any
  read: boolean
}

export default function MessagesPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const providerId = searchParams.get('provider')
  
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Load conversations
  useEffect(() => {
    if (!user) return

    const conversationsQuery = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid)
    )

    const unsubscribe = onSnapshot(conversationsQuery, async (snapshot) => {
      const conversationData: Conversation[] = []
      
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data()
        const otherParticipantId = data.participants.find((id: string) => id !== user.uid)
        
        if (otherParticipantId) {
          try {
            const userDoc = await getDoc(doc(db, 'users', otherParticipantId))
            const otherParticipant = userDoc.exists() ? userDoc.data() : null
            
            conversationData.push({
              id: docSnap.id,
              participants: data.participants,
              lastMessage: data.lastMessage,
              lastMessageTime: data.lastMessageTime,
              unreadCount: data.unreadCount?.[user.uid] || 0,
              otherParticipant: otherParticipant ? {
                uid: otherParticipantId,
                displayName: otherParticipant.displayName || otherParticipant.email,
                email: otherParticipant.email,
                company: otherParticipant.company,
                role: otherParticipant.role
              } : undefined
            })
          } catch (error) {
            console.error('Error fetching participant data:', error)
          }
        }
      }
      
      setConversations(conversationData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  // Auto-start conversation with provider if specified
  useEffect(() => {
    if (providerId && conversations.length > 0 && user) {
      const existingConversation = conversations.find(conv => 
        conv.otherParticipant?.uid === providerId
      )
      
      if (existingConversation) {
        setSelectedConversation(existingConversation)
      } else {
        // Create new conversation
        startNewConversation(providerId)
      }
    }
  }, [providerId, conversations, user])

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return

    const messagesQuery = query(
      collection(db, 'messages'),
      where('conversationId', '==', selectedConversation.id),
      orderBy('timestamp', 'asc')
    )

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageData: Message[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        conversationId: docSnap.data().conversationId,
        senderId: docSnap.data().senderId,
        content: docSnap.data().content,
        timestamp: docSnap.data().timestamp,
        read: docSnap.data().read || false
      }))
      
      setMessages(messageData)
    })

    return () => unsubscribe()
  }, [selectedConversation])

  const startNewConversation = async (otherUserId: string) => {
    if (!user) return

    try {
      const conversationRef = await addDoc(collection(db, 'conversations'), {
        participants: [user.uid, otherUserId],
        createdAt: serverTimestamp(),
        lastMessage: '',
        lastMessageTime: serverTimestamp(),
        unreadCount: { [user.uid]: 0, [otherUserId]: 0 }
      })

      // Fetch other participant data
      const userDoc = await getDoc(doc(db, 'users', otherUserId))
      const otherParticipant = userDoc.exists() ? userDoc.data() : null

      const newConversation: Conversation = {
        id: conversationRef.id,
        participants: [user.uid, otherUserId],
        otherParticipant: otherParticipant ? {
          uid: otherUserId,
          displayName: otherParticipant.displayName || otherParticipant.email,
          email: otherParticipant.email,
          company: otherParticipant.company,
          role: otherParticipant.role
        } : undefined
      }

      setSelectedConversation(newConversation)
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return

    try {
      await addDoc(collection(db, 'messages'), {
        conversationId: selectedConversation.id,
        senderId: user.uid,
        content: newMessage.trim(),
        timestamp: serverTimestamp(),
        read: false
      })

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.otherParticipant?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherParticipant?.company?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        </div>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div className="flex items-center space-x-2">
                  <Bot className="h-8 w-8 text-blue-600" />
                  <span className="text-xl font-bold text-gray-900">Messages</span>
                </div>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                <Link href="/messages" className="text-blue-600 font-medium">Messages</Link>
                <Link href="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <div className="col-span-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Messages
                    <Badge variant="secondary">
                      {conversations.filter(c => (c.unreadCount || 0) > 0).length}
                    </Badge>
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search conversations..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <p>No conversations yet</p>
                      <p className="text-sm">Start messaging providers from the browse page</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 ${
                            selectedConversation?.id === conversation.id
                              ? 'border-l-blue-500 bg-blue-50'
                              : 'border-l-transparent'
                          }`}
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>
                                  {conversation.otherParticipant?.displayName?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900 truncate">
                                  {conversation.otherParticipant?.displayName || 'Unknown User'}
                                </h3>
                                <div className="flex items-center space-x-2">
                                  {(conversation.unreadCount || 0) > 0 && (
                                    <Badge variant="default" className="h-5 w-5 p-0 text-xs">
                                      {conversation.unreadCount}
                                    </Badge>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {conversation.lastMessageTime?.toDate?.()?.toLocaleTimeString() || ''}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mb-1">
                                {conversation.otherParticipant?.company || 'No company'}
                              </p>
                              <p className="text-sm text-gray-600 truncate">
                                {conversation.lastMessage || 'No messages yet'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="col-span-8">
              {selectedConversation ? (
                <Card className="h-full flex flex-col">
                  {/* Chat Header */}
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {selectedConversation.otherParticipant?.displayName?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {selectedConversation.otherParticipant?.displayName || 'Unknown User'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {selectedConversation.otherParticipant?.company || 'No company'} • 
                            {selectedConversation.otherParticipant?.role === 'provider' ? ' AI Provider' : ' Client'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 p-4 overflow-y-auto">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <p>No messages yet</p>
                          <p className="text-sm">Start the conversation!</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === user?.uid
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.senderId === user?.uid ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {message.timestamp?.toDate?.()?.toLocaleTimeString() || ''}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p>Select a conversation to start messaging</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}

