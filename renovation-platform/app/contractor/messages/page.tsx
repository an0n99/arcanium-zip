"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format, formatDistanceToNow } from "date-fns"
import { Paperclip, Search, Send, Image, File, MoreVertical, Phone, Video } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Mock data for conversations
const mockConversations = [
  {
    id: 1,
    client: {
      id: "client-001",
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JS",
    },
    project: {
      id: "project-001",
      name: "Kitchen Renovation",
    },
    lastMessage: {
      text: "When will the cabinets be installed?",
      timestamp: new Date(2025, 2, 8, 14, 35), // March 8, 2025, 2:35 PM
      isRead: false,
      sender: "client",
    },
    unreadCount: 2,
  },
  {
    id: 2,
    client: {
      id: "client-002",
      name: "Emily Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EJ",
    },
    project: {
      id: "project-002",
      name: "Bathroom Remodel",
    },
    lastMessage: {
      text: "I've sent over the tile samples as requested.",
      timestamp: new Date(2025, 2, 7, 10, 15), // March 7, 2025, 10:15 AM
      isRead: true,
      sender: "contractor",
    },
    unreadCount: 0,
  },
  {
    id: 3,
    client: {
      id: "client-003",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MB",
    },
    project: {
      id: "project-003",
      name: "Basement Finishing",
    },
    lastMessage: {
      text: "The permits have been approved. We can start next week.",
      timestamp: new Date(2025, 2, 6, 16, 22), // March 6, 2025, 4:22 PM
      isRead: true,
      sender: "contractor",
    },
    unreadCount: 0,
  },
  {
    id: 4,
    client: {
      id: "client-004",
      name: "Sarah Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SW",
    },
    project: {
      id: "project-004",
      name: "Deck Construction",
    },
    lastMessage: {
      text: "Can we discuss some changes to the railing design?",
      timestamp: new Date(2025, 2, 5, 9, 45), // March 5, 2025, 9:45 AM
      isRead: false,
      sender: "client",
    },
    unreadCount: 1,
  },
  {
    id: 5,
    client: {
      id: "client-005",
      name: "David Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DL",
    },
    project: {
      id: "project-005",
      name: "Home Office Conversion",
    },
    lastMessage: {
      text: "The built-in shelving looks fantastic! Thank you.",
      timestamp: new Date(2025, 2, 4, 17, 30), // March 4, 2025, 5:30 PM
      isRead: true,
      sender: "client",
    },
    unreadCount: 0,
  },
]

// Mock message history for each conversation
const mockMessageHistory = {
  1: [
    {
      id: 101,
      text: "Hi John, I wanted to check in about the kitchen renovation progress.",
      timestamp: new Date(2025, 2, 8, 10, 15),
      sender: "contractor",
      isRead: true,
    },
    {
      id: 102,
      text: "Thanks for checking in. Everything looks good so far. I had a question about the timeline.",
      timestamp: new Date(2025, 2, 8, 11, 30),
      sender: "client",
      isRead: true,
    },
    {
      id: 103,
      text: "Of course, what would you like to know?",
      timestamp: new Date(2025, 2, 8, 11, 45),
      sender: "contractor",
      isRead: true,
    },
    {
      id: 104,
      text: "When will the cabinets be installed?",
      timestamp: new Date(2025, 2, 8, 14, 35),
      sender: "client",
      isRead: false,
    },
  ],
  2: [
    {
      id: 201,
      text: "Hello Emily, I wanted to discuss the tile options for your bathroom remodel.",
      timestamp: new Date(2025, 2, 6, 9, 0),
      sender: "contractor",
      isRead: true,
    },
    {
      id: 202,
      text: "Hi! I've been looking at some options online. Do you have any samples you could show me?",
      timestamp: new Date(2025, 2, 6, 10, 25),
      sender: "client",
      isRead: true,
    },
    {
      id: 203,
      text: "I can bring some samples to our next meeting. I have several options that would work well with your design.",
      timestamp: new Date(2025, 2, 6, 11, 15),
      sender: "contractor",
      isRead: true,
    },
    {
      id: 204,
      text: "That would be great. When can you come by?",
      timestamp: new Date(2025, 2, 6, 14, 0),
      sender: "client",
      isRead: true,
    },
    {
      id: 205,
      text: "I can stop by tomorrow afternoon around 2pm if that works for you.",
      timestamp: new Date(2025, 2, 6, 15, 30),
      sender: "contractor",
      isRead: true,
    },
    {
      id: 206,
      text: "Perfect! I'll see you then.",
      timestamp: new Date(2025, 2, 6, 16, 45),
      sender: "client",
      isRead: true,
    },
    {
      id: 207,
      text: "I've sent over the tile samples as requested.",
      timestamp: new Date(2025, 2, 7, 10, 15),
      sender: "contractor",
      isRead: true,
    },
  ],
  3: [
    {
      id: 301,
      text: "Hello Michael, I've submitted the permit applications for your basement project.",
      timestamp: new Date(2025, 2, 1, 11, 0),
      sender: "contractor",
      isRead: true,
    },
    {
      id: 302,
      text: "Great! How long do you think it will take to get approved?",
      timestamp: new Date(2025, 2, 1, 12, 30),
      sender: "client",
      isRead: true,
    },
    {
      id: 303,
      text: "Usually it takes about 1-2 weeks. I'll keep you updated on the progress.",
      timestamp: new Date(2025, 2, 1, 13, 15),
      sender: "contractor",
      isRead: true,
    },
    {
      id: 304,
      text: "Thanks, I appreciate it.",
      timestamp: new Date(2025, 2, 1, 14, 0),
      sender: "client",
      isRead: true,
    },
    {
      id: 305,
      text: "Just checking in - any news on the permits?",
      timestamp: new Date(2025, 2, 5, 10, 30),
      sender: "client",
      isRead: true,
    },
    {
      id: 306,
      text: "I just heard back from the building department. They're reviewing it now and should have an answer in the next day or two.",
      timestamp: new Date(2025, 2, 5, 11, 45),
      sender: "contractor",
      isRead: true,
    },
    {
      id: 307,
      text: "The permits have been approved. We can start next week.",
      timestamp: new Date(2025, 2, 6, 16, 22),
      sender: "contractor",
      isRead: true,
    },
  ],
  4: [
    {
      id: 401,
      text: "Hi Sarah, I've finalized the deck plans based on our last conversation.",
      timestamp: new Date(2025, 2, 3, 14, 0),
      sender: "contractor",
      isRead: true,
    },
    {
      id: 402,
      text: "Great! Can you send them over so I can take a look?",
      timestamp: new Date(2025, 2, 3, 15, 30),
      sender: "client",
      isRead: true,
    },
    {
      id: 403,
      text: "Just sent them to your email. Let me know what you think!",
      timestamp: new Date(2025, 2, 3, 16, 15),
      sender: "contractor",
      isRead: true,
    },
    {
      id: 404,
      text: "Got them, thanks! I'll review them tonight.",
      timestamp: new Date(2025, 2, 3, 17, 0),
      sender: "client",
      isRead: true,
    },
    {
      id: 405,
      text: "Can we discuss some changes to the railing design?",
      timestamp: new Date(2025, 2, 5, 9, 45),
      sender: "client",
      isRead: false,
    },
  ],
  5: [
    {
      id: 501,
      text: "David, we've completed the framing for your home office built-ins.",
      timestamp: new Date(2025, 2, 2, 13, 0),
      sender: "contractor",
      isRead: true,
    },
    {
      id: 502,
      text: "That's great news! When will you start on the shelving?",
      timestamp: new Date(2025, 2, 2, 14, 30),
      sender: "client",
      isRead: true,
    },
    {
      id: 503,
      text: "We'll be installing the shelves tomorrow. Should be done by end of day.",
      timestamp: new Date(2025, 2, 2, 15, 15),
      sender: "contractor",
      isRead: true,
    },
    {
      id: 504,
      text: "Perfect! I'm excited to see how it turns out.",
      timestamp: new Date(2025, 2, 2, 16, 0),
      sender: "client",
      isRead: true,
    },
    {
      id: 505,
      text: "We've finished the installation. Here are some photos of the completed shelving.",
      timestamp: new Date(2025, 2, 4, 16, 45),
      sender: "contractor",
      isRead: true,
      attachments: [
        { type: "image", name: "shelving-front.jpg" },
        { type: "image", name: "shelving-angle.jpg" },
      ],
    },
    {
      id: 506,
      text: "The built-in shelving looks fantastic! Thank you.",
      timestamp: new Date(2025, 2, 4, 17, 30),
      sender: "client",
      isRead: true,
    },
  ],
}

export default function ContractorMessagesPage() {
  const [conversations, setConversations] = useState(mockConversations)
  const [activeConversation, setActiveConversation] = useState<number | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Check if there's a client or project parameter in the URL
  useEffect(() => {
    const clientId = searchParams.get("client")
    const projectId = searchParams.get("project")

    if (clientId) {
      const conversation = conversations.find((c) => c.client.id === clientId)
      if (conversation) {
        setActiveConversation(conversation.id)
      }
    } else if (projectId) {
      const conversation = conversations.find((c) => c.project.id === `project-${projectId}`)
      if (conversation) {
        setActiveConversation(conversation.id)
      }
    } else if (conversations.length > 0 && !activeConversation) {
      // Default to first conversation if none is selected
      setActiveConversation(conversations[0].id)
    }
  }, [searchParams, conversations, activeConversation])

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      const conversationMessages = mockMessageHistory[activeConversation] || []
      setMessages(conversationMessages)

      // Mark messages as read
      const updatedConversations = conversations.map((conv) => {
        if (conv.id === activeConversation) {
          return { ...conv, unreadCount: 0, lastMessage: { ...conv.lastMessage, isRead: true } }
        }
        return conv
      })
      setConversations(updatedConversations)
    }
  }, [activeConversation])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conv) => {
    const clientNameMatch = conv.client.name.toLowerCase().includes(searchTerm.toLowerCase())
    const projectNameMatch = conv.project.name.toLowerCase().includes(searchTerm.toLowerCase())
    const messageMatch = conv.lastMessage.text.toLowerCase().includes(searchTerm.toLowerCase())
    return clientNameMatch || projectNameMatch || messageMatch
  })

  // Handle sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !activeConversation) return

    // Create new message
    const newMsg = {
      id: Math.floor(Math.random() * 10000),
      text: newMessage,
      timestamp: new Date(),
      sender: "contractor",
      isRead: true,
    }

    // Add to messages
    setMessages((prev) => [...prev, newMsg])

    // Update conversation
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === activeConversation) {
        return {
          ...conv,
          lastMessage: {
            text: newMessage,
            timestamp: new Date(),
            isRead: true,
            sender: "contractor",
          },
        }
      }
      return conv
    })
    setConversations(updatedConversations)

    // Clear input
    setNewMessage("")
  }

  // Format timestamp for display
  const formatMessageTime = (timestamp: Date) => {
    const now = new Date()
    const messageDate = new Date(timestamp)

    // If message is from today, show time
    if (messageDate.toDateString() === now.toDateString()) {
      return format(messageDate, "h:mm a")
    }

    // If message is from this week, show day and time
    if (now.getTime() - messageDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return format(messageDate, "EEE, h:mm a")
    }

    // Otherwise show date
    return format(messageDate, "MMM d, yyyy")
  }

  // Get active client
  const activeClient = activeConversation ? conversations.find((c) => c.id === activeConversation)?.client : null

  // Get active project
  const activeProject = activeConversation ? conversations.find((c) => c.id === activeConversation)?.project : null

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Communicate with clients about their projects.</p>
      </div>

      <div className="grid flex-1 gap-4 md:grid-cols-[300px_1fr]">
        {/* Conversations List */}
        <div className="flex flex-col border rounded-lg overflow-hidden">
          <div className="border-b p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Tabs defaultValue="all" className="flex-1">
            <div className="border-b px-3">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all" className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <p className="text-muted-foreground">No conversations found</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`flex cursor-pointer items-start gap-3 border-b p-3 transition-colors hover:bg-muted/50 ${
                        activeConversation === conversation.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setActiveConversation(conversation.id)}
                    >
                      <Avatar>
                        <AvatarImage src={conversation.client.avatar} />
                        <AvatarFallback>{conversation.client.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium ${conversation.unreadCount > 0 ? "font-semibold" : ""}`}>
                            {conversation.client.name}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(conversation.lastMessage.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{conversation.project.name}</p>
                        <p className="line-clamp-1 text-sm">
                          {conversation.lastMessage.sender === "contractor" && "You: "}
                          {conversation.lastMessage.text}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && <Badge className="ml-auto">{conversation.unreadCount}</Badge>}
                    </div>
                  ))
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="unread" className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                {filteredConversations.filter((c) => c.unreadCount > 0).length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <p className="text-muted-foreground">No unread messages</p>
                  </div>
                ) : (
                  filteredConversations
                    .filter((c) => c.unreadCount > 0)
                    .map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`flex cursor-pointer items-start gap-3 border-b p-3 transition-colors hover:bg-muted/50 ${
                          activeConversation === conversation.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setActiveConversation(conversation.id)}
                      >
                        <Avatar>
                          <AvatarImage src={conversation.client.avatar} />
                          <AvatarFallback>{conversation.client.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{conversation.client.name}</p>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(conversation.lastMessage.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{conversation.project.name}</p>
                          <p className="line-clamp-1 text-sm">
                            {conversation.lastMessage.sender === "contractor" && "You: "}
                            {conversation.lastMessage.text}
                          </p>
                        </div>
                        <Badge className="ml-auto">{conversation.unreadCount}</Badge>
                      </div>
                    ))
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Message Thread */}
        {activeConversation ? (
          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={activeClient?.avatar} />
                  <AvatarFallback>{activeClient?.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{activeClient?.name}</CardTitle>
                  <CardDescription>{activeProject?.name}</CardDescription>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-[calc(100vh-20rem)]">
                <div className="flex flex-col gap-3 p-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "contractor" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "contractor" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <div className="space-y-2">
                          <p>{message.text}</p>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {message.attachments.map((attachment, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-1 rounded bg-background/50 p-1 text-xs"
                                >
                                  {attachment.type === "image" ? (
                                    <Image className="h-4 w-4" />
                                  ) : (
                                    <File className="h-4 w-4" />
                                  )}
                                  <span>{attachment.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="mt-1 text-right text-xs opacity-70">{formatMessageTime(message.timestamp)}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t p-3">
              <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                <Button type="button" variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center">
            <CardHeader>
              <CardTitle>Select a Conversation</CardTitle>
              <CardDescription>Choose a conversation from the list to start messaging</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}

