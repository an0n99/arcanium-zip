"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Star,
  MapPin,
  Mail,
  Phone,
  Clock,
  DollarSign,
  Briefcase,
  Award,
  MessageSquare,
  UserPlus,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for subcontractor details
const getSubcontractorData = (id: string) => {
  return {
    id,
    name: "Mike Johnson",
    company: "Johnson Electrical Services",
    avatar: "/placeholder.svg?height=100&width=100",
    initials: "MJ",
    specialty: "Electrician",
    rating: 4.8,
    completedProjects: 32,
    location: "Seattle, WA",
    email: "mike@johnsonelectrical.com",
    phone: "(206) 555-1234",
    website: "www.johnsonelectrical.com",
    hourlyRate: 75,
    availability: "Available",
    skills: [
      "Residential Wiring",
      "Commercial Electrical",
      "Lighting Installation",
      "Panel Upgrades",
      "Electrical Troubleshooting",
      "Code Compliance",
      "Smart Home Integration",
      "Generator Installation",
    ],
    certifications: [
      "Licensed Master Electrician",
      "OSHA Certified",
      "National Electrical Code (NEC) Certified",
      "Energy Efficiency Specialist",
    ],
    bio: "Over 15 years of experience in residential and commercial electrical work. Specializing in new construction, remodels, and electrical troubleshooting. My team and I pride ourselves on quality workmanship, reliability, and customer satisfaction. We stay up-to-date with the latest electrical codes and technologies to provide the best service possible.",
    yearsExperience: 15,
    teamSize: 4,
    insurance: {
      liability: "$2,000,000",
      workersComp: "Yes",
    },
    paymentMethods: ["Check", "Credit Card", "Bank Transfer"],
    reviews: [
      {
        id: "rev-001",
        clientName: "Robert Wilson",
        projectName: "Home Renovation",
        date: "2025-01-15",
        rating: 5,
        comment:
          "Mike and his team did an excellent job rewiring our entire home. They were professional, efficient, and left the work area clean. Would definitely hire again.",
      },
      {
        id: "rev-002",
        clientName: "Jennifer Adams",
        projectName: "Kitchen Remodel",
        date: "2024-11-20",
        rating: 4,
        comment:
          "Good work installing new lighting and outlets in our kitchen. Completed the job on time and within budget.",
      },
      {
        id: "rev-003",
        clientName: "David Chen",
        projectName: "Office Building Upgrade",
        date: "2024-09-05",
        rating: 5,
        comment:
          "Johnson Electrical handled our commercial electrical upgrade professionally. They worked around our business hours to minimize disruption and the quality of work was outstanding.",
      },
    ],
    portfolio: [
      {
        id: "port-001",
        title: "Commercial Office Lighting",
        description: "Complete lighting upgrade for a 10,000 sq ft office space",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "port-002",
        title: "Residential Rewiring",
        description: "Full house rewiring for a 1950s home",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "port-003",
        title: "Smart Home Installation",
        description: "Smart lighting, security, and automation system",
        image: "/placeholder.svg?height=200&width=300",
      },
    ],
    availability_calendar: [
      { date: "2025-03-15", status: "available" },
      { date: "2025-03-16", status: "available" },
      { date: "2025-03-17", status: "booked" },
      { date: "2025-03-18", status: "booked" },
      { date: "2025-03-19", status: "available" },
      { date: "2025-03-20", status: "available" },
      { date: "2025-03-21", status: "available" },
    ],
  }
}

// Mock data for active projects to invite subcontractors to
const activeProjects = [
  { id: "proj-001", name: "Modern Kitchen Renovation" },
  { id: "proj-002", name: "Master Bathroom Remodel" },
  { id: "proj-003", name: "Basement Finishing" },
  { id: "proj-004", name: "Deck Construction" },
]

export default function SubcontractorDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [subcontractor, setSubcontractor] = useState(getSubcontractorData(params.id))
  const [inviteProject, setInviteProject] = useState("")
  const [inviteMessage, setInviteMessage] = useState("")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [message, setMessage] = useState("")

  // Handle inviting a subcontractor
  const handleInvite = () => {
    if (!inviteProject) {
      toast({
        title: "Please select a project",
        description: "You must select a project to invite the subcontractor to.",
        variant: "destructive",
      })
      return
    }

    // Reset form
    setInviteProject("")
    setInviteMessage("")
    setIsInviteDialogOpen(false)

    // Show success message
    toast({
      title: "Invitation Sent",
      description: `Invitation sent to ${subcontractor.name} for the selected project.`,
    })
  }

  // Handle sending a message
  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message to send.",
        variant: "destructive",
      })
      return
    }

    // Reset form
    setMessage("")
    setIsMessageDialogOpen(false)

    // Show success message
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${subcontractor.name}.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{subcontractor.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={subcontractor.avatar} />
                  <AvatarFallback className="text-2xl">{subcontractor.initials}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{subcontractor.name}</CardTitle>
                <CardDescription className="text-base">{subcontractor.company}</CardDescription>
                <Badge className="mt-2">{subcontractor.specialty}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                <span className="text-lg font-medium">{subcontractor.rating}</span>
                <span className="text-sm text-muted-foreground">({subcontractor.completedProjects} projects)</span>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{subcontractor.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{subcontractor.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{subcontractor.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${subcontractor.hourlyRate}/hr typical rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span
                    className={subcontractor.availability.includes("Available") ? "text-green-600" : "text-amber-600"}
                  >
                    {subcontractor.availability}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <h3 className="font-medium">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {subcontractor.certifications.map((cert) => (
                    <Badge key={cert} variant="outline">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite to Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Subcontractor</DialogTitle>
                    <DialogDescription>
                      Send an invitation to {subcontractor.name} to join your project.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Select Project</label>
                      <Select value={inviteProject} onValueChange={setInviteProject}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a project" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeProjects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Message (Optional)</label>
                      <Textarea
                        placeholder="Add a personal message..."
                        value={inviteMessage}
                        onChange={(e) => setInviteMessage(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleInvite}>Send Invitation</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Message</DialogTitle>
                    <DialogDescription>Send a direct message to {subcontractor.name}.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Message</label>
                      <Textarea
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSendMessage}>Send Message</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{subcontractor.bio}</p>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Years Experience</p>
                        <p>{subcontractor.yearsExperience} years</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Team Size</p>
                        <p>{subcontractor.teamSize} people</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {subcontractor.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Insurance</h3>
                      <p className="text-sm">Liability: {subcontractor.insurance.liability}</p>
                      <p className="text-sm">Workers' Comp: {subcontractor.insurance.workersComp}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Payment Methods</h3>
                      <p className="text-sm">{subcontractor.paymentMethods.join(", ")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Portfolio</CardTitle>
                  <CardDescription>Previous work examples</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {subcontractor.portfolio.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="h-48 w-full object-cover"
                        />
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Reviews</CardTitle>
                  <CardDescription>Feedback from previous clients</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subcontractor.reviews.map((review) => (
                    <Card key={review.id} className="border">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">{review.clientName}</CardTitle>
                            <CardDescription>{review.projectName}</CardDescription>
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{review.comment}</p>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/50 py-2">
                        <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                      </CardFooter>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                  <CardDescription>Check when this subcontractor is available</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Current Status</h3>
                      <Badge
                        variant={subcontractor.availability.includes("Available") ? "default" : "outline"}
                        className={subcontractor.availability.includes("Available") ? "" : "text-amber-600"}
                      >
                        {subcontractor.availability}
                      </Badge>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-4">Upcoming Availability</h3>
                      <div className="grid grid-cols-7 gap-2">
                        {subcontractor.availability_calendar.map((day, index) => (
                          <div key={index} className="text-center">
                            <div className="text-sm font-medium">
                              {new Date(day.date).toLocaleDateString(undefined, { weekday: "short" })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(day.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                            </div>
                            <div
                              className={`mt-2 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                day.status === "available"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                            >
                              {day.status === "available" ? "Open" : "Booked"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

