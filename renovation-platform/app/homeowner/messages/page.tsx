"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Paperclip, Image, File, Phone, Video, Info, Clock } from "lucide-react"
import { format } from "date-fns"

type Contact = {
  id: number
  name: string
  role: "contractor" | "designer" | "supplier" | "admin"
  avatar: string
  lastMessage: string
  lastMessageTime: Date
  unread: number
  online: boolean
  projectId?: number
  projectName?: string
}

type Message = {
  id: number
  senderId: number
  receiverId: number
  content: string
  timestamp: Date
  read: boolean
  attachments?: {
    type: "image" | "file"
    url: string
    name: string
  }[]
}

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock data for contacts
  const contacts: Contact[] = [
    {
      id: 1,
      name: "ABC Renovations",
      role: "contractor",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I'll bring the cabinet samples tomorrow at 10am.",
      lastMessageTime: new Date(2025, 2, 10, 14, 35), // Mar 10, 2025, 2:35 PM
      unread: 2,
      online: true,
      projectId: 1,
      projectName: "Kitchen Renovation",
    },
    {
      id: 2,
      name: "Modern Bathrooms Inc.",
      role: "contractor",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "The tile installation will start next Monday.",
      lastMessageTime: new Date(2025, 2, 9, 10, 15), // Mar 9, 2025, 10:15 AM
      unread: 0,
      online: false,
      projectId: 2,
      projectName: "Bathroom Remodel",
    },
    {
      id: 3,
      name: "Elite Carpentry",
      role: "contractor",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Looking forward to our design consultation next month.",
      lastMessageTime: new Date(2025, 2, 5, 16, 22), // Mar 5, 2025, 4:22 PM
      unread: 0,
      online: true,
      projectId: 3,
      projectName: "Living Room Renovation",
    },
    {
      id: 4,
      name: "Sarah Johnson",
      role: "designer",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I've sent you the updated kitchen design renderings.",
      lastMessageTime: new Date(2025, 2, 8, 11, 45), // Mar 8, 2025, 11:45 AM
      unread: 1,
      online: false,
      projectId: 1,
      projectName: "Kitchen Renovation",
    },
    {
      id: 5,
      name: "Stone Supply Co.",
      role: "supplier",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Your countertop is scheduled for delivery on March 25th.",
      lastMessageTime: new Date(2025, 2, 7, 9, 30), // Mar 7, 2025, 9:30 AM
      unread: 0,
      online: true,
      projectId: 1,
      projectName: "Kitchen Renovation",
    },
    {
      id: 6,
      name: "RenovateEase Support",
      role: "admin",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "How can we help improve your renovation experience?",
      lastMessageTime: new Date(2025, 2, 1, 13, 10), // Mar 1, 2025, 1:10 PM
      unread: 0,
      online: true,
    },
  ]

  // Mock data for messages
  const [messages, setMessages] = useState<Message[]>([
    // Conversation with ABC Renovations
    {
      id: 1,
      senderId: 1, // ABC Renovations
      receiverId: 0, // User
      content: "Good morning! I wanted to confirm our meeting tomorrow to discuss the cabinet installation.",
      timestamp: new Date(2025, 2, 9, 9, 30), // Mar 9, 2025, 9:30 AM
      read: true,
    },
    {
      id: 2,
      senderId: 0, // User
      receiverId: 1, // ABC Renovations
      content: "Good morning! Yes, tomorrow works for me. What time were you thinking?",
      timestamp: new Date(2025, 2, 9, 10, 15), // Mar 9, 2025, 10:15 AM
      read: true,
    },
    {
      id: 3,
      senderId: 1, // ABC Renovations
      receiverId: 0, // User
      content: "How about 10am? I'll bring the cabinet samples so you can see the finish options in person.",
      timestamp: new Date(2025, 2, 9, 10, 45), // Mar 9, 2025, 10:45 AM
      read: true,
    },
    {
      id: 4,
      senderId: 0, // User
      receiverId: 1, // ABC Renovations
      content: "10am works perfectly. I'm particularly interested in seeing the different hardware options as well.",
      timestamp: new Date(2025, 2, 9, 11, 30), // Mar 9, 2025, 11:30 AM
      read: true,
    },
    {
      id: 5,
      senderId: 1, // ABC Renovations
      receiverId: 0, // User
      content:
        "Great! I'll bring a selection of hardware options too. Here are some photos of the cabinet styles we discussed.",
      timestamp: new Date(2025, 2, 10, 14, 0), // Mar 10, 2025, 2:00 PM
      read: false,
      attachments: [
        {
          type: "image",
          url: "/placeholder.svg?height=300&width=400",
          name: "cabinet_style_1.jpg",
        },
        {
          type: "image",
          url: "/placeholder.svg?height=300&width=400",
          name: "cabinet_style_2.jpg",
        },
      ],
    },
    {
      id: 6,
      senderId: 1, // ABC Renovations
      receiverId: 0, // User
      content: "I'll bring the cabinet samples tomorrow at 10am.",
      timestamp: new Date(2025, 2, 10, 14, 35), // Mar 10, 2025, 2:35 PM
      read: false,
    },

    // Conversation with Modern Bathrooms Inc.
    {
      id: 7,
      senderId: 2, // Modern Bathrooms Inc.
      receiverId: 0, // User
      content: "Hello! I wanted to update you on the bathroom remodel timeline.",
      timestamp: new Date(2025, 2, 8, 15, 20), // Mar 8, 2025, 3:20 PM
      read: true,
    },
    {
      id: 8,
      senderId: 0, // User
      receiverId: 2, // Modern Bathrooms Inc.
      content: "Hi there! Thanks for the update. What's the latest on our timeline?",
      timestamp: new Date(2025, 2, 8, 16, 5), // Mar 8, 2025, 4:05 PM
      read: true,
    },
    {
      id: 9,
      senderId: 2, // Modern Bathrooms Inc.
      receiverId: 0, // User
      content: "We're on track with the plumbing rough-in. The tile installation will start next Monday.",
      timestamp: new Date(2025, 2, 9, 10, 15), // Mar 9, 2025, 10:15 AM
      read: true,
    },
  ])

  // Filter contacts based on search term
  const filteredContacts = contacts
    .filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.projectName && contact.projectName.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime())

  // Get messages for selected contact
  const contactMessages = selectedContact
    ? messages
        .filter(
          (message) =>
            (message.senderId === selectedContact.id && message.receiverId === 0) ||
            (message.senderId === 0 && message.receiverId === selectedContact.id),
        )
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    : []

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !selectedContact) return

    const newMsg: Message = {
      id: messages.length + 1,
      senderId: 0, // User
      receiverId: selectedContact.id,
      content: newMessage,
      timestamp: new Date(),
      read: true,
    }

    setMessages([...messages, newMsg])
    setNewMessage("")

    // Simulate reply after 1-3 seconds
    if (Math.random() > 0.5) {
      const replyDelay = 1000 + Math.random() * 2000
      setTimeout(() => {
        const reply: Message = {
          id: messages.length + 2,
          senderId: selectedContact.id,
          receiverId: 0, // User
          content: "Thanks for your message. I'll get back to you soon.",
          timestamp: new Date(Date.now() + replyDelay),
          read: false,
        }
        setMessages((prevMessages) => [...prevMessages, reply])
      }, replyDelay)
    }
  }

  // Format time for display
  const formatMessageTime = (date: Date) => {
    const now = new Date()
    const isToday =
      date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()

    if (isToday) {
      return format(date, "h:mm a") // e.g., "2:35 PM"
    } else {
      return format(date, "MMM d, h:mm a") // e.g., "Mar 10, 2:35 PM"
    }
  }

  // Format time for contact list
  const formatContactTime = (date: Date) => {
    const now = new Date()
    const isToday =
      date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()

    if (isToday) {
      return format(date, "h:mm a") // e.g., "2:35 PM"
    } else {
      return format(date, "MMM d") // e.g., "Mar 10"
    }
  }

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [contactMessages])

  // Mark messages as read when contact is selected
  useEffect(() => {
    if (selectedContact) {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.senderId === selectedContact.id && message.receiverId === 0 && !message.read
            ? { ...message, read: true }
            : message,
        ),
      )

      // Update unread count in contacts
      const updatedContacts = contacts.map((contact) =>
        contact.id === selectedContact.id ? { ...contact, unread: 0 } : contact,
      )
    }
  }, [selectedContact])

  return (
    <div className="h-[calc(100vh-13rem)]">
      <div className="flex h-full rounded-lg border overflow-hidden">
        {/* Contacts sidebar */}
        <div className="w-full sm:w-80 border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-3 hover:bg-muted/50 cursor-pointer ${selectedContact?.id === contact.id ? "bg-muted" : ""}`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      {contact.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{contact.name}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatContactTime(contact.lastMessageTime)}
                        </span>
                      </div>
                      {contact.projectName && <p className="text-xs text-primary truncate">{contact.projectName}</p>}
                      <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                    </div>
                    {contact.unread > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat area */}
        {selectedContact ? (
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={selectedContact.avatar} />
                    <AvatarFallback>{selectedContact.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  {selectedContact.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedContact.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {selectedContact.role.charAt(0).toUpperCase() + selectedContact.role.slice(1)}
                    </Badge>
                    {selectedContact.online ? (
                      <span className="text-xs text-green-500">Online</span>
                    ) : (
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> Last active:{" "}
                        {formatContactTime(selectedContact.lastMessageTime)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {contactMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.senderId === 0 ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] ${message.senderId === 0 ? "order-2" : "order-1"}`}>
                      {message.senderId !== 0 && (
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={selectedContact.avatar} />
                            <AvatarFallback>{selectedContact.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{selectedContact.name}</span>
                        </div>
                      )}

                      <div
                        className={`rounded-lg p-3 ${
                          message.senderId === 0 ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>

                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 grid gap-2 grid-cols-2">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="relative">
                                {attachment.type === "image" ? (
                                  <div className="rounded-md overflow-hidden border">
                                    <img
                                      src={attachment.url || "/placeholder.svg"}
                                      alt={attachment.name}
                                      className="w-full h-auto object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 p-2 rounded-md border">
                                    <File className="h-4 w-4" />
                                    <span className="text-xs truncate">{attachment.name}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <div
                          className={`text-xs mt-1 ${message.senderId === 0 ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                        >
                          {formatMessageTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Image className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSendMessage} disabled={newMessage.trim() === ""}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

