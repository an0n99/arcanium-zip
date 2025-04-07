"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Calendar, Clock, DollarSign, FileText, MessageSquare, Search } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

// Mock data for bids
const mockBids = [
  {
    id: 1,
    projectName: "Kitchen Renovation",
    client: "John Smith",
    clientId: "client-001",
    location: "123 Main St, Boston, MA",
    bidAmount: 28500,
    estimatedDuration: "4-6 weeks",
    submittedDate: new Date(2025, 2, 1), // March 1, 2025
    status: "under-review",
    description: "Complete kitchen renovation including new cabinets, countertops, and appliances.",
    notes: "Client emphasized quality materials and timely completion.",
    competingBids: 3,
  },
  {
    id: 2,
    projectName: "Bathroom Remodel",
    client: "Emily Johnson",
    clientId: "client-002",
    location: "456 Oak Ave, Cambridge, MA",
    bidAmount: 15750,
    estimatedDuration: "3 weeks",
    submittedDate: new Date(2025, 1, 25), // Feb 25, 2025
    status: "under-review",
    description: "Master bathroom remodel with new shower, vanity, and fixtures.",
    notes: "Client prefers eco-friendly materials.",
    competingBids: 2,
  },
  {
    id: 3,
    projectName: "Basement Finishing",
    client: "Michael Brown",
    clientId: "client-003",
    location: "789 Pine St, Somerville, MA",
    bidAmount: 32000,
    estimatedDuration: "6-8 weeks",
    submittedDate: new Date(2025, 1, 20), // Feb 20, 2025
    status: "accepted",
    description: "Convert unfinished basement into living space with bedroom, bathroom, and recreation area.",
    notes: "Client wants to maximize space and include proper insulation.",
    competingBids: 4,
  },
  {
    id: 4,
    projectName: "Deck Construction",
    client: "Sarah Wilson",
    clientId: "client-004",
    location: "321 Elm St, Brookline, MA",
    bidAmount: 12800,
    estimatedDuration: "2 weeks",
    submittedDate: new Date(2025, 1, 15), // Feb 15, 2025
    status: "rejected",
    description: "Build a 400 sq ft composite deck with railing and stairs.",
    notes: "Client selected a competitor with slightly lower bid.",
    competingBids: 5,
  },
  {
    id: 5,
    projectName: "Home Office Conversion",
    client: "David Lee",
    clientId: "client-005",
    location: "654 Maple Dr, Newton, MA",
    bidAmount: 9500,
    estimatedDuration: "1-2 weeks",
    submittedDate: new Date(2025, 1, 10), // Feb 10, 2025
    status: "accepted",
    description: "Convert spare bedroom into functional home office with built-in shelving and desk.",
    notes: "Client works from home and needs the space completed quickly.",
    competingBids: 2,
  },
  {
    id: 6,
    projectName: "Exterior Painting",
    client: "Jennifer Garcia",
    clientId: "client-006",
    location: "987 Cedar Ln, Medford, MA",
    bidAmount: 8200,
    estimatedDuration: "1 week",
    submittedDate: new Date(2025, 1, 5), // Feb 5, 2025
    status: "under-review",
    description: "Paint exterior of two-story colonial home including trim and shutters.",
    notes: "Client is considering color options and comparing quotes.",
    competingBids: 3,
  },
]

// Status mapping for display
const statusMap = {
  "under-review": { label: "Under Review", color: "bg-yellow-500" },
  accepted: { label: "Accepted", color: "bg-green-500" },
  rejected: { label: "Rejected", color: "bg-red-500" },
  withdrawn: { label: "Withdrawn", color: "bg-gray-500" },
}

export default function ContractorBidsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

  // Filter and sort bids
  const filteredBids = mockBids
    .filter((bid) => {
      // Apply search filter
      const matchesSearch =
        bid.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.location.toLowerCase().includes(searchTerm.toLowerCase())

      // Apply status filter
      const matchesStatus = statusFilter === "all" || bid.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Apply sorting
      let comparison = 0
      if (sortBy === "date") {
        comparison = a.submittedDate.getTime() - b.submittedDate.getTime()
      } else if (sortBy === "amount") {
        comparison = a.bidAmount - b.bidAmount
      } else if (sortBy === "name") {
        comparison = a.projectName.localeCompare(b.projectName)
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

  // Calculate statistics
  const totalBids = mockBids.length
  const acceptedBids = mockBids.filter((bid) => bid.status === "accepted").length
  const pendingBids = mockBids.filter((bid) => bid.status === "under-review").length
  const rejectedBids = mockBids.filter((bid) => bid.status === "rejected").length
  const totalBidAmount = mockBids.reduce((sum, bid) => sum + bid.bidAmount, 0)
  const acceptedBidAmount = mockBids
    .filter((bid) => bid.status === "accepted")
    .reduce((sum, bid) => sum + bid.bidAmount, 0)

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Bids</h1>
        <p className="text-muted-foreground">Manage and track all your project bids in one place.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBids}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBids}</div>
            <p className="text-xs text-muted-foreground">Awaiting client decision</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBids ? Math.round((acceptedBids / totalBids) * 100) : 0}%</div>
            <p className="text-xs text-muted-foreground">{acceptedBids} accepted bids</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Potential Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBidAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">${acceptedBidAmount.toLocaleString()} confirmed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects, clients, or locations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="under-review">Under Review</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="withdrawn">Withdrawn</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Submission Date</SelectItem>
            <SelectItem value="amount">Bid Amount</SelectItem>
            <SelectItem value="name">Project Name</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={toggleSortOrder} className="w-full md:w-auto">
          <ArrowUpDown className="mr-2 h-4 w-4" />
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </Button>
      </div>

      {/* Tabs for bid status */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Bids</TabsTrigger>
          <TabsTrigger value="under-review">Under Review</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        {["all", "under-review", "accepted", "rejected"].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-4">
            {filteredBids.length === 0 ? (
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>No Bids Found</CardTitle>
                  <CardDescription>
                    {searchTerm
                      ? "Try adjusting your search or filters"
                      : "You don't have any bids in this category yet"}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center">
                  <Button asChild>
                    <Link href="/contractor/opportunities">Find Projects to Bid</Link>
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredBids
                  .filter((bid) => tabValue === "all" || bid.status === tabValue)
                  .map((bid) => (
                    <Card key={bid.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{bid.projectName}</CardTitle>
                            <CardDescription>{bid.client}</CardDescription>
                          </div>
                          <Badge className={`${statusMap[bid.status].color} text-white`}>
                            {statusMap[bid.status].label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground flex items-center">
                              <DollarSign className="mr-1 h-4 w-4" /> Bid Amount
                            </span>
                            <span className="font-medium">${bid.bidAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground flex items-center">
                              <Clock className="mr-1 h-4 w-4" /> Duration
                            </span>
                            <span className="font-medium">{bid.estimatedDuration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground flex items-center">
                              <Calendar className="mr-1 h-4 w-4" /> Submitted
                            </span>
                            <span className="font-medium">{format(bid.submittedDate, "MMM d, yyyy")}</span>
                          </div>
                          {bid.status === "under-review" && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Competing Bids</span>
                              <span className="font-medium">{bid.competingBids}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 text-sm">
                          <p className="text-muted-foreground line-clamp-2">{bid.description}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/contractor/bids/${bid.id}`}>
                            <FileText className="mr-2 h-4 w-4" /> Details
                          </Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/contractor/messages?client=${bid.clientId}`}>
                            <MessageSquare className="mr-2 h-4 w-4" /> Contact Client
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

