"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle,
  Award,
  PenToolIcon as Tool,
  ThumbsUp,
  ArrowLeft,
  Share2,
  Bookmark,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Contractor = {
  id: number
  name: string
  specialty: string
  rating: number
  reviews: number
  hourlyRate: number
  location: string
  distance: string
  availability: string
  verified: boolean
  image: string
  description: string
  specialties: string[]
  yearsExperience: number
  email?: string
  phone?: string
  completedProjects?: number
  licensesAndInsurance?: string[]
  gallery?: string[]
  services?: {
    name: string
    description: string
    price?: string
  }[]
  reviewsList?: {
    author: string
    date: string
    rating: number
    comment: string
    projectType: string
  }[]
}

export default function ContractorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [contractor, setContractor] = useState<Contractor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    // For now, we'll use mock data
    const mockContractors: Contractor[] = [
      {
        id: 1,
        name: "ABC Renovations",
        specialty: "Kitchen & Bath",
        specialties: ["Kitchen", "Bathroom", "Plumbing"],
        rating: 4.8,
        reviews: 124,
        hourlyRate: 85,
        location: "New York, NY",
        distance: "3.2 miles",
        availability: "Available from Apr 10",
        verified: true,
        image: "/placeholder.svg?height=120&width=120",
        description: "Specializing in high-end kitchen and bathroom renovations with over 15 years of experience.",
        yearsExperience: 15,
        email: "info@abcrenovations.com",
        phone: "(555) 123-4567",
        completedProjects: 215,
        licensesAndInsurance: [
          "Licensed General Contractor #GC12345",
          "Fully Insured - Liability & Workers Comp",
          "Certified Kitchen Designer (CKD)",
          "Certified Bathroom Designer (CBD)",
        ],
        gallery: [
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400",
        ],
        services: [
          {
            name: "Kitchen Remodeling",
            description:
              "Complete kitchen renovations including cabinets, countertops, flooring, and appliance installation.",
            price: "$15,000 - $50,000",
          },
          {
            name: "Bathroom Remodeling",
            description: "Full bathroom renovations including tiling, fixtures, vanities, and custom showers.",
            price: "$10,000 - $30,000",
          },
          {
            name: "Plumbing Services",
            description: "Installation and repair of plumbing fixtures, pipes, and water systems.",
            price: "$75 - $95/hour",
          },
          {
            name: "Custom Cabinetry",
            description: "Design and installation of custom cabinets for kitchens, bathrooms, and other spaces.",
            price: "Custom quote required",
          },
        ],
        reviewsList: [
          {
            author: "Jennifer M.",
            date: "Feb 15, 2025",
            rating: 5,
            comment:
              "ABC Renovations transformed our outdated kitchen into a modern, functional space. They were professional, on time, and stayed within budget. Highly recommend!",
            projectType: "Kitchen Remodel",
          },
          {
            author: "Michael T.",
            date: "Jan 28, 2025",
            rating: 4,
            comment:
              "Great work on our master bathroom. The tile work is exceptional. Only reason for 4 stars is they took a bit longer than expected, but the quality was worth the wait.",
            projectType: "Bathroom Renovation",
          },
          {
            author: "Sarah K.",
            date: "Dec 10, 2024",
            rating: 5,
            comment:
              "We hired ABC for a complete kitchen overhaul and couldn't be happier. Their attention to detail and craftsmanship is outstanding. They also helped us stay within our budget with smart material choices.",
            projectType: "Kitchen Remodel",
          },
          {
            author: "David L.",
            date: "Nov 5, 2024",
            rating: 5,
            comment:
              "Professional team that delivered exactly what they promised. Our guest bathroom looks amazing and the work was completed on schedule.",
            projectType: "Bathroom Renovation",
          },
        ],
      },
      {
        id: 2,
        name: "Modern Bathrooms Inc.",
        specialty: "Bathroom Remodeling",
        specialties: ["Bathroom", "Plumbing", "Tile"],
        rating: 4.6,
        reviews: 98,
        hourlyRate: 75,
        location: "New York, NY",
        distance: "5.7 miles",
        availability: "Available from Mar 25",
        verified: true,
        image: "/placeholder.svg?height=120&width=120",
        description: "Bathroom renovation specialists with a focus on modern designs and water-saving fixtures.",
        yearsExperience: 8,
        email: "info@modernbathrooms.com",
        phone: "(555) 234-5678",
        completedProjects: 145,
        licensesAndInsurance: [
          "Licensed Plumbing Contractor #PC7890",
          "Fully Insured - Liability & Workers Comp",
          "Certified Tile Installer",
        ],
        gallery: [
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400",
        ],
        services: [
          {
            name: "Full Bathroom Remodel",
            description:
              "Complete bathroom renovations including demolition, plumbing, electrical, tile, fixtures, and finishes.",
            price: "$8,000 - $25,000",
          },
          {
            name: "Shower/Tub Conversion",
            description:
              "Convert tub to shower or vice versa, including waterproofing, tiling, and fixture installation.",
            price: "$4,500 - $8,000",
          },
          {
            name: "Tile Installation",
            description: "Professional tile installation for floors, walls, showers, and backsplashes.",
            price: "$12 - $25 per square foot",
          },
        ],
        reviewsList: [
          {
            author: "Robert J.",
            date: "Mar 2, 2025",
            rating: 5,
            comment:
              "Modern Bathrooms did an amazing job on our master bath. They were efficient, clean, and the result is stunning.",
            projectType: "Master Bathroom Remodel",
          },
          {
            author: "Lisa P.",
            date: "Feb 12, 2025",
            rating: 4,
            comment:
              "Good quality work and reasonable prices. The tile work is beautiful. Communication could have been better at times.",
            projectType: "Guest Bathroom Renovation",
          },
        ],
      },
      {
        id: 3,
        name: "Elite Carpentry",
        specialty: "Carpentry & Woodwork",
        specialties: ["Carpentry", "Flooring", "Cabinetry"],
        rating: 4.9,
        reviews: 87,
        hourlyRate: 95,
        location: "Brooklyn, NY",
        distance: "7.1 miles",
        availability: "Available from Apr 5",
        verified: true,
        image: "/placeholder.svg?height=120&width=120",
        description: "Master carpenters specializing in custom woodwork, built-ins, and hardwood flooring.",
        yearsExperience: 20,
        email: "info@elitecarpentry.com",
        phone: "(555) 345-6789",
        completedProjects: 180,
        licensesAndInsurance: [
          "Licensed Carpentry Contractor #CC4567",
          "Fully Insured - Liability & Workers Comp",
          "Master Carpenter Certification",
        ],
        gallery: [
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400",
          "/placeholder.svg?height=300&width=400",
        ],
        services: [
          {
            name: "Custom Cabinetry",
            description: "Design and build custom cabinets for kitchens, bathrooms, and other spaces.",
            price: "Custom quote required",
          },
          {
            name: "Hardwood Flooring",
            description: "Installation, refinishing, and repair of hardwood floors.",
            price: "$8 - $15 per square foot",
          },
          {
            name: "Custom Built-ins",
            description: "Custom bookcases, entertainment centers, and storage solutions.",
            price: "Custom quote required",
          },
        ],
        reviewsList: [
          {
            author: "Thomas B.",
            date: "Jan 15, 2025",
            rating: 5,
            comment:
              "Elite Carpentry built custom bookshelves for our living room and they are absolutely beautiful. The craftsmanship is exceptional.",
            projectType: "Custom Built-ins",
          },
          {
            author: "Amanda R.",
            date: "Dec 20, 2024",
            rating: 5,
            comment:
              "We had our hardwood floors refinished and they look brand new. Professional team, clean work, and great results.",
            projectType: "Hardwood Floor Refinishing",
          },
        ],
      },
    ]

    // Find the contractor by ID
    const id = Number(params.id)
    const foundContractor = mockContractors.find((c) => c.id === id)

    // Simulate API call
    setTimeout(() => {
      setContractor(foundContractor || null)
      setLoading(false)
    }, 500)
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading contractor profile...</p>
        </div>
      </div>
    )
  }

  if (!contractor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Contractor Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The contractor you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/homeowner/find-contractors">Back to Contractors</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Contractors
      </Button>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Avatar className="h-24 w-24 rounded-md">
                  <AvatarImage src={contractor.image} alt={contractor.name} />
                  <AvatarFallback>{contractor.name.substring(0, 2)}</AvatarFallback>
                </Avatar>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold">{contractor.name}</h1>
                    {contractor.verified && (
                      <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50">
                        Verified
                      </Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground">{contractor.specialty}</p>

                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(contractor.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : i < contractor.rating
                                ? "text-yellow-400 fill-yellow-400 opacity-50"
                                : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{contractor.rating}</span>
                    <span className="text-sm text-muted-foreground">({contractor.reviews} reviews)</span>
                  </div>

                  <p className="text-sm">{contractor.description}</p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <span className="text-sm flex items-center">
                      <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                      {contractor.location} ({contractor.distance})
                    </span>
                    <span className="text-sm flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      {contractor.availability}
                    </span>
                    <span className="text-sm flex items-center">
                      <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />${contractor.hourlyRate}/hr
                    </span>
                    <span className="text-sm flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      {contractor.yearsExperience} years experience
                    </span>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                  <Button className="flex-1 sm:w-36">
                    <MessageSquare className="mr-2 h-4 w-4" /> Contact
                  </Button>
                  <Button variant="outline" className="flex-1 sm:w-36">
                    <FileText className="mr-2 h-4 w-4" /> Request Quote
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="about" className="space-y-4">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About {contractor.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Overview</h3>
                    <p>{contractor.description}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {contractor.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Licenses & Insurance</h3>
                    <ul className="space-y-1">
                      {contractor.licensesAndInsurance?.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <Award className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{contractor.yearsExperience}</p>
                      <p className="text-sm text-muted-foreground">Years Experience</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <CheckCircle className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{contractor.completedProjects}</p>
                      <p className="text-sm text-muted-foreground">Projects Completed</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <Star className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{contractor.rating}</p>
                      <p className="text-sm text-muted-foreground">Average Rating</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <ThumbsUp className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{contractor.reviews}</p>
                      <p className="text-sm text-muted-foreground">Client Reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{contractor.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{contractor.email}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{contractor.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                  <CardDescription>Here are the main services provided by {contractor.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {contractor.services?.map((service, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-lg">{service.name}</h3>
                          {service.price && <Badge variant="outline">{service.price}</Badge>}
                        </div>
                        <p className="text-muted-foreground">{service.description}</p>
                        {index < (contractor.services?.length || 0) - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <FileText className="mr-2 h-4 w-4" /> Request a Quote
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Gallery</CardTitle>
                  <CardDescription>View photos of past projects completed by {contractor.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {contractor.gallery?.map((image, index) => (
                      <div key={index} className="aspect-video rounded-md overflow-hidden border">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Project by ${contractor.name}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle>Client Reviews</CardTitle>
                      <CardDescription>See what others are saying about {contractor.name}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(contractor.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : i < contractor.rating
                                  ? "text-yellow-400 fill-yellow-400 opacity-50"
                                  : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium text-lg">{contractor.rating}</span>
                      <span className="text-muted-foreground">({contractor.reviews} reviews)</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {contractor.reviewsList?.map((review, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{review.author}</h3>
                            <p className="text-sm text-muted-foreground">{review.projectType}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                        {index < (contractor.reviewsList?.length || 0) - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:w-1/3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Request a Quote</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Type</label>
                  <Select defaultValue="kitchen">
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kitchen">Kitchen Remodel</SelectItem>
                      <SelectItem value="bathroom">Bathroom Remodel</SelectItem>
                      <SelectItem value="flooring">Flooring Installation</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Timeline</label>
                  <Select defaultValue="1-3months">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">As soon as possible</SelectItem>
                      <SelectItem value="1month">Within 1 month</SelectItem>
                      <SelectItem value="1-3months">1-3 months</SelectItem>
                      <SelectItem value="3-6months">3-6 months</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Description</label>
                  <textarea
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Briefly describe your project..."
                  ></textarea>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Submit Quote Request</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Next Available Date</span>
                  <Badge variant="outline" className="text-green-600">
                    {contractor.availability.replace("Available from ", "")}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>March 2025</span>
                    <span className="text-muted-foreground">75% Booked</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>April 2025</span>
                    <span className="text-muted-foreground">50% Booked</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>May 2025</span>
                    <span className="text-muted-foreground">25% Booked</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Bookmark className="mr-2 h-4 w-4" /> Save to Favorites
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="mr-2 h-4 w-4" /> Share Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Tool className="mr-2 h-4 w-4" /> Compare with Others
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

