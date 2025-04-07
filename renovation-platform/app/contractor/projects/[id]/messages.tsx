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
import { Paperclip, Search, Send, Image, File, MoreVertical, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for project subcontractors
const mockSubcontractors = [
  {
    id: "sub-001",
    name: "Mike Johnson",
    company: "Johnson Electrical Services",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MJ",
    specialty: "Electrician",
    status: "active",
    unreadCount: 2,
    lastMessage: {
      text: "I'll need access to the electrical panel tomorrow.",
      timestamp: new Date(2025, 2, 8, 14, 35),
      isRead: false,
      sender: "subcontractor",
    },
  },
  {
    id: "sub-002",
    name: "Sarah Williams",
    company: "Williams Plumbing Co.",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SW",
    specialty: "Plumber",
    status: "active",
    unreadCount: 0,
    lastMessage: {
      text: "The rough-in plumbing is complete. Ready for inspection.",
      timestamp: new Date(2025, 2, 7, 10, 15),
      isRead: true,
      sender: "subcontractor",
    },
  },
  {
    id: "sub-003",
    name: "Carlos Rodriguez",
    company: "Rodriguez Carpentry",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "CR",
    specialty: "Carpenter",
    status: "pending",
    unreadCount: 0,
    lastMessage: null,
  },
]

// Mock message history for each subcontractor
const mockMessageHistory = {
  "sub-001": [
    {
      id: 101,
      text: "Hi Mike, I wanted to check in on the electrical work progress.",
      timestamp: new Date(2025, 2, 8, 10, 15),
      sender: "contractor",
      isRead: true,
    },
    {
      id: 102,
      text: "Everything is going well. We've completed about 75% of the rough-in.",
      timestamp: new Date(2025, 2, 8, 11, 30),
      sender: "subcontractor",
      isRead: true,
    },
    {
      id: 103,
      text: "Great! Any issues or concerns so far?",
      timestamp: new Date(2025, 2, 8, 11, 45),
      sender: "contractor",
      isRead: true,
    },
    {
      id: 104,
      text: "I'll need access to the electrical panel tomorrow.",
      timestamp: new Date(2025, 2, 8, 14, 35),
      sender: "subcontractor",
      isRead: false,
    },
  ],
  "sub-002": [
    {
      id: 201,
      text: "Sarah, when do you expect to finish the plumbing rough-in?",
      timestamp: new Date(2025, 2, 6, 9, 0),
      sender: "contractor",
      isRead: true,
    },
    {
      id: 202,
      text: "We should be done by tomorrow afternoon.",
      timestamp: new Date(2025, 2, 6, 10, 25),
      sender: "subcontractor",
      isRead: true,
    },
    {
      id: 203,
      text: "Perfect. I'll schedule the inspection for the day after.",
      timestamp: new Date(2025, 2, 6, 11, 15),
      sender: "contractor",
      isRead: true,
    },
    {
      id: 204,
      text: "Sounds good. We'll make sure everything is ready.",
      timestamp: new Date(2025, 2, 6, 14, 0),
      sender: "subcontractor",
      isRead: true,
    },
    {
      id: 205,
      text: "The rough-in plumbing is complete. Ready for inspection.",
      timestamp: new Date(2025, 2, 7, 10, 15),
      sender: "subcontractor",
      isRead: true,
    },
  ],
}

export default function ProjectMessages() {
  const [subcontractors, setSubcontractors] = useState(mockSubcontractors)
  const [activeSubcontractor, setActiveSubcontractor] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Set default active subcontractor if none is selected
  useEffect(() => {
    if (subcontractors.length > 0 && !activeSubcontractor) {
      // Default to first active subcontractor
      const firstActive = subcontractors.find((sub) => sub.status === "active")
      if (firstActive) {
        setActiveSubcontractor(firstActive.id)
      }
    }
  }, [subcontractors, activeSubcontractor])

  // Load messages when active subcontractor changes
  useEffect(() => {
    if (activeSubcontractor) {
      const subcontractorMessages = mockMessageHistory[activeSubcontractor] || []
      setMessages(subcontractorMessages)

      // Mark messages as read
      setSubcontractors((prev) =>
        prev.map((sub) => {
          if (sub.id === activeSubcontractor) {
            return {
              ...sub,
              unreadCount: 0,
              lastMessage: sub.lastMessage ? { ...sub.lastMessage, isRead: true } : null,
            }
          }
          return sub
        }),
      )
    }
  }, [activeSubcontractor])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Filter subcontractors based on search term
  const filteredSubcontractors = subcontractors.filter((sub) => {
    if (sub.status !== "active") return false

    const searchLower = searchTerm.toLowerCase()
    return (
      sub.name.toLowerCase().includes(searchLower) ||
      sub.company.toLowerCase().includes(searchLower) ||
      sub.specialty.toLowerCase().includes(searchLower) ||
      sub.lastMessage?.text.toLowerCase().includes(searchLower)
    )
  })

  // Handle sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !activeSubcontractor) return

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

    // Update subcontractor
    setSubcontractors((prev) =>
      prev.map((sub) => {
        if (sub.id === activeSubcontractor) {
          return {
            ...sub,
            lastMessage: {
              text: newMessage,
              timestamp: new Date(),
              isRead: true,
              sender: "contractor",
            },
          }
        }
        return sub
      }),
    )

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

  // Get active subcontractor
  const activeSubcontractorData = activeSubcontractor
    ? subcontractors.find((sub) => sub.id === activeSubcontractor)
    : null

  return (
    <div className="flex h-[calc(100vh-16rem)] flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Project Messages</h2>
        <p className="text-muted-foreground">Communicate with your project subcontractors</p>
      </div>

      <div className="grid flex-1 gap-4 md:grid-cols-[300px_1fr]">
        {/* Subcontractors List */}
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
              <ScrollArea className="h-[calc(100vh-22rem)]">
                {filteredSubcontractors.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <p className="text-muted-foreground">No active subcontractors found</p>
                  </div>
                ) : (
                  filteredSubcontractors.map((subcontractor) => (
                    <div
                      key={subcontractor.id}
                      className={`flex cursor-pointer items-start gap-3 border-b p-3 transition-colors hover:bg-muted/50 ${
                        activeSubcontractor === subcontractor.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setActiveSubcontractor(subcontractor.id)}
                    >
                      <Avatar>
                        <AvatarImage src={subcontractor.avatar} />
                        <AvatarFallback>{subcontractor.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium ${subcontractor.unreadCount > 0 ? "font-semibold" : ""}`}>
                            {subcontractor.name}
                          </p>
                          {subcontractor.lastMessage && (
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(subcontractor.lastMessage.timestamp, { addSuffix: true })}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{subcontractor.specialty}</p>
                        {subcontractor.lastMessage ? (
                          <p className="line-clamp-1 text-sm">
                            {subcontractor.lastMessage.sender === "contractor" && "You: "}
                            {subcontractor.lastMessage.text}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No messages yet</p>
                        )}
                      </div>
                      {subcontractor.unreadCount > 0 && <Badge className="ml-auto">{subcontractor.unreadCount}</Badge>}
                    </div>
                  ))
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="unread" className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-22rem)]">
                {filteredSubcontractors.filter((sub) => sub.unreadCount > 0).length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <p className="text-muted-foreground">No unread messages</p>
                  </div>
                ) : (
                  filteredSubcontractors
                    .filter((sub) => sub.unreadCount > 0)
                    .map((subcontractor) => (
                      <div
                        key={subcontractor.id}
                        className={`flex cursor-pointer items-start gap-3 border-b p-3 transition-colors hover:bg-muted/50 ${
                          activeSubcontractor === subcontractor.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setActiveSubcontractor(subcontractor.id)}
                      >
                        <Avatar>
                          <AvatarImage src={subcontractor.avatar} />
                          <AvatarFallback>{subcontractor.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{subcontractor.name}</p>
                            {subcontractor.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(subcontractor.lastMessage.timestamp, { addSuffix: true })}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{subcontractor.specialty}</p>
                          {subcontractor.lastMessage && (
                            <p className="line-clamp-1 text-sm">
                              {subcontractor.lastMessage.sender === "contractor" && "You: "}
                              {subcontractor.lastMessage.text}
                            </p>
                          )}
                        </div>
                        <Badge className="ml-auto">{subcontractor.unreadCount}</Badge>
                      </div>
                    ))
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Message Thread */}
        {activeSubcontractor && activeSubcontractorData ? (
          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={activeSubcontractorData.avatar} />
                  <AvatarFallback>{activeSubcontractorData.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{activeSubcontractorData.name}</CardTitle>
                  <CardDescription>
                    {activeSubcontractorData.specialty} • {activeSubcontractorData.company}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-[calc(100vh-26rem)]">
                <div className="flex flex-col gap-3 p-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                      <p className="text-muted-foreground">No messages yet</p>
                      <p className="text-sm text-muted-foreground">Send a message to start the conversation</p>
                    </div>
                  ) : (
                    messages.map((message) => (
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
                          <div className="mt-1 text-right text-xs opacity-70">
                            {formatMessageTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
              <CardTitle>Select a Subcontractor</CardTitle>
              <CardDescription>Choose a subcontractor from the list to start messaging</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}

