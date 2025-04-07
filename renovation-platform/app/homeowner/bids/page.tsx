"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  MessageSquare,
  FileText,
  CheckCircle,
  X,
  Clock,
  DollarSign,
  Calendar,
  Search,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

type Bid = {
  id: number
  projectName: string
  projectId: number
  contractor: {
    id: number
    name: string
    rating: number
    reviews: number
    image: string
    verified: boolean
  }
  amount: number
  status: "pending" | "accepted" | "declined" | "expired"
  submittedDate: string
  expiryDate: string
  description: string
  timeline: string
  materials: string[]
}

export default function BidsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-new")
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false)
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false)
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null)
  const [messageText, setMessageText] = useState("")
  const [declineReason, setDeclineReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data for bids
  const [bids, setBids] = useState<Bid[]>([
    {
      id: 1,
      projectName: "Kitchen Renovation",
      projectId: 1,
      contractor: {
        id: 1,
        name: "ABC Renovations",
        rating: 4.8,
        reviews: 124,
        image: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      amount: 24500,
      status: "pending",
      submittedDate: "Mar 5, 2025",
      expiryDate: "Mar 19, 2025",
      description:
        "Complete kitchen renovation including custom cabinets, quartz countertops, new appliances, and tile backsplash. Price includes all materials, labor, and cleanup.",
      timeline: "4-6 weeks",
      materials: ["Custom cabinets", "Quartz countertops", "Tile backsplash", "Sink and faucet"],
    },
    {
      id: 2,
      projectName: "Kitchen Renovation",
      projectId: 1,
      contractor: {
        id: 10,
        name: "Custom Kitchens",
        rating: 4.9,
        reviews: 103,
        image: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      amount: 28750,
      status: "pending",
      submittedDate: "Mar 4, 2025",
      expiryDate: "Mar 18, 2025",
      description:
        "Premium kitchen remodel with high-end finishes. Includes custom cabinetry with soft-close drawers, premium countertops, designer backsplash, and all new fixtures.",
      timeline: "5-7 weeks",
      materials: ["Premium custom cabinets", "Marble countertops", "Designer backsplash", "High-end fixtures"],
    },
    {
      id: 3,
      projectName: "Bathroom Remodel",
      projectId: 2,
      contractor: {
        id: 2,
        name: "Modern Bathrooms Inc.",
        rating: 4.6,
        reviews: 98,
        image: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      amount: 12800,
      status: "accepted",
      submittedDate: "Feb 28, 2025",
      expiryDate: "Mar 14, 2025",
      description:
        "Complete bathroom renovation including new vanity, shower, toilet, and tile work. Includes all fixtures, materials, and labor.",
      timeline: "3-4 weeks",
      materials: ["Vanity and countertop", "Shower system", "Porcelain tile", "New toilet"],
    },
    {
      id: 4,
      projectName: "Bathroom Remodel",
      projectId: 2,
      contractor: {
        id: 4,
        name: "Precision Plumbing",
        rating: 4.7,
        reviews: 112,
        image: "/placeholder.svg?height=40&width=40",
        verified: false,
      },
      amount: 11500,
      status: "declined",
      submittedDate: "Feb 26, 2025",
      expiryDate: "Mar 12, 2025",
      description:
        "Bathroom remodel with focus on plumbing upgrades. New shower, toilet, sink, and all associated plumbing. Includes basic tile work and fixtures.",
      timeline: "2-3 weeks",
      materials: ["Standard vanity", "Shower system", "Ceramic tile", "New toilet"],
    },
    {
      id: 5,
      projectName: "Living Room Renovation",
      projectId: 3,
      contractor: {
        id: 3,
        name: "Elite Carpentry",
        rating: 4.9,
        reviews: 87,
        image: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      amount: 9800,
      status: "expired",
      submittedDate: "Feb 10, 2025",
      expiryDate: "Feb 24, 2025",
      description:
        "Custom built-in shelving and entertainment center for living room. Includes design, materials, construction, and finishing.",
      timeline: "2 weeks",
      materials: ["Hardwood", "Hardware", "Paint/stain", "Glass shelving"],
    },
    {
      id: 6,
      projectName: "Basement Finishing",
      projectId: 4,
      contractor: {
        id: 12,
        name: "Basement Transformations",
        rating: 4.7,
        reviews: 52,
        image: "/placeholder.svg?height=40&width=40",
        verified: false,
      },
      amount: 32500,
      status: "pending",
      submittedDate: "Mar 1, 2025",
      expiryDate: "Mar 15, 2025",
      description:
        "Complete basement finishing including framing, drywall, electrical, flooring, and bathroom. Turn your unfinished basement into a functional living space.",
      timeline: "6-8 weeks",
      materials: ["Framing lumber", "Drywall", "Flooring", "Bathroom fixtures", "Electrical supplies"],
    },
  ])

  // Filter and sort bids
  const filteredBids = bids
    .filter((bid) => {
      // Filter by search term
      const matchesSearch =
        bid.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.description.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by status
      const matchesStatus = statusFilter === "all" || bid.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Sort by selected criteria
      switch (sortBy) {
        case "date-new":
          return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
        case "date-old":
          return new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime()
        case "price-high":
          return b.amount - a.amount
        case "price-low":
          return a.amount - b.amount
        case "rating":
          return b.contractor.rating - a.contractor.rating
        default:
          return 0
      }
    })

  const getStatusBadge = (status: Bid["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pending Review
          </Badge>
        )
      case "accepted":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Accepted</Badge>
      case "declined":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Declined</Badge>
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Expired</Badge>
      default:
        return null
    }
  }

  const handleAcceptBid = (bid: Bid) => {
    setSelectedBid(bid)
    setIsAcceptDialogOpen(true)
  }

  const handleDeclineBid = (bid: Bid) => {
    setSelectedBid(bid)
    setIsDeclineDialogOpen(true)
  }

  const handleMessageContractor = (bid: Bid) => {
    setSelectedBid(bid)
    setIsMessageDialogOpen(true)
  }

  const confirmAcceptBid = async () => {
    if (!selectedBid) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the bid status in our state
      setBids((prevBids) => prevBids.map((bid) => (bid.id === selectedBid.id ? { ...bid, status: "accepted" } : bid)))

      toast({
        title: "Bid accepted!",
        description: `You've accepted the bid from ${selectedBid.contractor.name}.`,
      })

      setIsAcceptDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error accepting bid",
        description: "There was an error accepting this bid. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDeclineBid = async () => {
    if (!selectedBid) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the bid status in our state
      setBids((prevBids) => prevBids.map((bid) => (bid.id === selectedBid.id ? { ...bid, status: "declined" } : bid)))

      toast({
        title: "Bid declined",
        description: `You've declined the bid from ${selectedBid.contractor.name}.`,
      })

      setIsDeclineDialogOpen(false)
      setDeclineReason("")
    } catch (error) {
      toast({
        title: "Error declining bid",
        description: "There was an error declining this bid. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const sendMessage = async () => {
    if (!selectedBid || !messageText.trim()) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Message sent!",
        description: `Your message has been sent to ${selectedBid.contractor.name}.`,
      })

      setIsMessageDialogOpen(false)
      setMessageText("")
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Received Bids</h1>
          <p className="text-muted-foreground">Review and manage contractor bids for your renovation projects.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bids by project or contractor..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-new">Newest First</SelectItem>
              <SelectItem value="date-old">Oldest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Contractor Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Bids ({bids.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({bids.filter((b) => b.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({bids.filter((b) => b.status === "accepted").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredBids.length === 0 ? (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No bids found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters to see more results.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
              >
                Reset Filters
              </Button>
            </Card>
          ) : (
            filteredBids.map((bid) => (
              <Card key={bid.id} className="overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  <div className="p-6 flex-1">
                    <div className="flex flex-col md:flex-row gap-4 md:items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold">{bid.projectName}</h3>
                            <p className="text-sm text-muted-foreground">Bid #{bid.id}</p>
                          </div>
                          {getStatusBadge(bid.status)}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 mt-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={bid.contractor.image} />
                              <AvatarFallback>{bid.contractor.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <Link
                              href={`/homeowner/contractors/${bid.contractor.id}`}
                              className="text-sm font-medium hover:underline"
                            >
                              {bid.contractor.name}
                            </Link>
                            {bid.contractor.verified && (
                              <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50 text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(bid.contractor.rating)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : i < bid.contractor.rating
                                        ? "text-yellow-400 fill-yellow-400 opacity-50"
                                        : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-medium">{bid.contractor.rating}</span>
                            <span className="text-xs text-muted-foreground">({bid.contractor.reviews})</span>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                              Bid Amount
                            </span>
                            <span className="text-sm font-bold">${bid.amount.toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-sm font-medium flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                              Timeline
                            </span>
                            <span className="text-sm">{bid.timeline}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-sm font-medium flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              Submitted
                            </span>
                            <span className="text-sm">{bid.submittedDate}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-sm font-medium flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              Expires
                            </span>
                            <span className="text-sm">{bid.expiryDate}</span>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div>
                          <h4 className="text-sm font-medium mb-2">Bid Description</h4>
                          <p className="text-sm text-muted-foreground">{bid.description}</p>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Materials Included</h4>
                          <div className="flex flex-wrap gap-2">
                            {bid.materials.map((material, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {material}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 lg:p-6 flex flex-row lg:flex-col gap-2 justify-end bg-muted/30 lg:border-l">
                    <div className="w-full lg:w-auto space-y-2">
                      {bid.status === "pending" && (
                        <>
                          <Button className="w-full lg:w-36" onClick={() => handleAcceptBid(bid)}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Accept Bid
                          </Button>
                          <Button variant="outline" className="w-full lg:w-36" onClick={() => handleDeclineBid(bid)}>
                            <X className="mr-2 h-4 w-4" /> Decline
                          </Button>
                        </>
                      )}
                      <Button variant="outline" className="w-full lg:w-36" onClick={() => handleMessageContractor(bid)}>
                        <MessageSquare className="mr-2 h-4 w-4" /> Message
                      </Button>
                      <Button variant="outline" className="w-full lg:w-36">
                        <FileText className="mr-2 h-4 w-4" /> View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filteredBids.filter((bid) => bid.status === "pending").length === 0 ? (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No pending bids</h3>
              <p className="text-muted-foreground mb-4">You don't have any pending bids that need your review.</p>
            </Card>
          ) : (
            filteredBids
              .filter((bid) => bid.status === "pending")
              .map((bid) => (
                <Card key={bid.id} className="overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    <div className="p-6 flex-1">
                      <div className="flex flex-col md:flex-row gap-4 md:items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-bold">{bid.projectName}</h3>
                              <p className="text-sm text-muted-foreground">Bid #{bid.id}</p>
                            </div>
                            {getStatusBadge(bid.status)}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 mt-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={bid.contractor.image} />
                                <AvatarFallback>{bid.contractor.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <Link
                                href={`/homeowner/contractors/${bid.contractor.id}`}
                                className="text-sm font-medium hover:underline"
                              >
                                {bid.contractor.name}
                              </Link>
                              {bid.contractor.verified && (
                                <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50 text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < Math.floor(bid.contractor.rating)
                                        ? "text-yellow-400 fill-yellow-400"
                                        : i < bid.contractor.rating
                                          ? "text-yellow-400 fill-yellow-400 opacity-50"
                                          : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-medium">{bid.contractor.rating}</span>
                              <span className="text-xs text-muted-foreground">({bid.contractor.reviews})</span>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium flex items-center">
                                <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                                Bid Amount
                              </span>
                              <span className="text-sm font-bold">${bid.amount.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-sm font-medium flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                Timeline
                              </span>
                              <span className="text-sm">{bid.timeline}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-sm font-medium flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                Submitted
                              </span>
                              <span className="text-sm">{bid.submittedDate}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-sm font-medium flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                Expires
                              </span>
                              <span className="text-sm">{bid.expiryDate}</span>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div>
                            <h4 className="text-sm font-medium mb-2">Bid Description</h4>
                            <p className="text-sm text-muted-foreground">{bid.description}</p>
                          </div>

                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Materials Included</h4>
                            <div className="flex flex-wrap gap-2">
                              {bid.materials.map((material, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {material}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 lg:p-6 flex flex-row lg:flex-col gap-2 justify-end bg-muted/30 lg:border-l">
                      <div className="w-full lg:w-auto space-y-2">
                        <Button className="w-full lg:w-36" onClick={() => handleAcceptBid(bid)}>
                          <CheckCircle className="mr-2 h-4 w-4" /> Accept Bid
                        </Button>
                        <Button variant="outline" className="w-full lg:w-36" onClick={() => handleDeclineBid(bid)}>
                          <X className="mr-2 h-4 w-4" /> Decline
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full lg:w-36"
                          onClick={() => handleMessageContractor(bid)}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" /> Message
                        </Button>
                        <Button variant="outline" className="w-full lg:w-36">
                          <FileText className="mr-2 h-4 w-4" /> View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {filteredBids.filter((bid) => bid.status === "accepted").length === 0 ? (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No accepted bids</h3>
              <p className="text-muted-foreground mb-4">You haven't accepted any bids yet.</p>
            </Card>
          ) : (
            filteredBids
              .filter((bid) => bid.status === "accepted")
              .map((bid) => (
                <Card key={bid.id} className="overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    <div className="p-6 flex-1">
                      <div className="flex flex-col md:flex-row gap-4 md:items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-bold">{bid.projectName}</h3>
                              <p className="text-sm text-muted-foreground">Bid #{bid.id}</p>
                            </div>
                            {getStatusBadge(bid.status)}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 mt-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={bid.contractor.image} />
                                <AvatarFallback>{bid.contractor.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <Link
                                href={`/homeowner/contractors/${bid.contractor.id}`}
                                className="text-sm font-medium hover:underline"
                              >
                                {bid.contractor.name}
                              </Link>
                              {bid.contractor.verified && (
                                <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50 text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < Math.floor(bid.contractor.rating)
                                        ? "text-yellow-400 fill-yellow-400"
                                        : i < bid.contractor.rating
                                          ? "text-yellow-400 fill-yellow-400 opacity-50"
                                          : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-medium">{bid.contractor.rating}</span>
                              <span className="text-xs text-muted-foreground">({bid.contractor.reviews})</span>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium flex items-center">
                                <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                                Bid Amount
                              </span>
                              <span className="text-sm font-bold">${bid.amount.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-sm font-medium flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                Timeline
                              </span>
                              <span className="text-sm">{bid.timeline}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-sm font-medium flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                Submitted
                              </span>
                              <span className="text-sm">{bid.submittedDate}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-sm font-medium flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                Expires
                              </span>
                              <span className="text-sm">{bid.expiryDate}</span>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div>
                            <h4 className="text-sm font-medium mb-2">Bid Description</h4>
                            <p className="text-sm text-muted-foreground">{bid.description}</p>
                          </div>

                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Materials Included</h4>
                            <div className="flex flex-wrap gap-2">
                              {bid.materials.map((material, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {material}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 lg:p-6 flex flex-row lg:flex-col gap-2 justify-end bg-muted/30 lg:border-l">
                      <div className="w-full lg:w-auto space-y-2">
                        <Button
                          variant="outline"
                          className="w-full lg:w-36"
                          onClick={() => handleMessageContractor(bid)}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" /> Message
                        </Button>
                        <Button variant="outline" className="w-full lg:w-36">
                          <FileText className="mr-2 h-4 w-4" /> View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
          )}
        </TabsContent>
      </Tabs>

      {/* Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Message Contractor</DialogTitle>
            <DialogDescription>
              Send a message to {selectedBid?.contractor.name} about their bid for {selectedBid?.projectName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Type your message here..."
              className="min-h-[150px]"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
          </div>
          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="secondary" onClick={() => setIsMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={sendMessage} disabled={!messageText.trim() || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" /> Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Accept Bid Dialog */}
      <Dialog open={isAcceptDialogOpen} onOpenChange={setIsAcceptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Bid</DialogTitle>
            <DialogDescription>
              Are you sure you want to accept this bid from {selectedBid?.contractor.name}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-md bg-muted p-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Project:</span>
                <span>{selectedBid?.projectName}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Contractor:</span>
                <span>{selectedBid?.contractor.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Bid Amount:</span>
                <span>${selectedBid?.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Timeline:</span>
                <span>{selectedBid?.timeline}</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              By accepting this bid, you are agreeing to hire this contractor for your project. The contractor will be
              notified and can begin work according to the agreed timeline.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAcceptDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={confirmAcceptBid} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" /> Accept Bid
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Bid Dialog */}
      <Dialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Bid</DialogTitle>
            <DialogDescription>
              Are you sure you want to decline this bid from {selectedBid?.contractor.name}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-md bg-muted p-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Project:</span>
                <span>{selectedBid?.projectName}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Contractor:</span>
                <span>{selectedBid?.contractor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Bid Amount:</span>
                <span>${selectedBid?.amount.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label htmlFor="decline-reason" className="text-sm font-medium">
                Reason for declining (optional):
              </label>
              <Textarea
                id="decline-reason"
                placeholder="Let the contractor know why you're declining their bid..."
                className="mt-1"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeclineDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDeclineBid} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" /> Decline Bid
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

