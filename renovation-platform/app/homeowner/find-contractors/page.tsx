"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MessageSquare, Filter, SearchIcon, MapPin, Clock, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

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
}

export default function FindContractorsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([50, 200])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRating, setSelectedRating] = useState("3")
  const [selectedAvailability, setSelectedAvailability] = useState("any")
  const [sortBy, setSortBy] = useState("rating")
  const [activeTab, setActiveTab] = useState("all")
  const [filteredContractors, setFilteredContractors] = useState<Contractor[]>([])

  // Mock data for contractors - expanded list
  const contractors: Contractor[] = [
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
      image: "/placeholder.svg?height=60&width=60",
      description: "Specializing in high-end kitchen and bathroom renovations with over 15 years of experience.",
      yearsExperience: 15,
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
      image: "/placeholder.svg?height=60&width=60",
      description: "Bathroom renovation specialists with a focus on modern designs and water-saving fixtures.",
      yearsExperience: 8,
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
      image: "/placeholder.svg?height=60&width=60",
      description: "Master carpenters specializing in custom woodwork, built-ins, and hardwood flooring.",
      yearsExperience: 20,
    },
    {
      id: 4,
      name: "Precision Plumbing",
      specialty: "Plumbing",
      specialties: ["Plumbing", "Bathroom", "Kitchen"],
      rating: 4.7,
      reviews: 112,
      hourlyRate: 65,
      location: "Queens, NY",
      distance: "8.3 miles",
      availability: "Available from Mar 20",
      verified: false,
      image: "/placeholder.svg?height=60&width=60",
      description:
        "Licensed plumbers handling everything from repairs to full bathroom and kitchen plumbing installations.",
      yearsExperience: 12,
    },
    {
      id: 5,
      name: "Bright Electrical",
      specialty: "Electrical",
      specialties: ["Electrical", "Lighting", "Smart Home"],
      rating: 4.5,
      reviews: 76,
      hourlyRate: 80,
      location: "Manhattan, NY",
      distance: "2.8 miles",
      availability: "Available Immediately",
      verified: true,
      image: "/placeholder.svg?height=60&width=60",
      description:
        "Licensed electricians specializing in residential rewiring, lighting design, and smart home integration.",
      yearsExperience: 10,
    },
    {
      id: 6,
      name: "Fresh Paint Pro",
      specialty: "Painting",
      specialties: ["Painting", "Drywall", "Finishing"],
      rating: 4.3,
      reviews: 92,
      hourlyRate: 55,
      location: "Bronx, NY",
      distance: "10.5 miles",
      availability: "Available from Apr 1",
      verified: true,
      image: "/placeholder.svg?height=60&width=60",
      description: "Professional painters offering interior and exterior painting services with eco-friendly options.",
      yearsExperience: 7,
    },
    {
      id: 7,
      name: "Tile Masters",
      specialty: "Tile & Stone",
      specialties: ["Tile", "Bathroom", "Kitchen", "Flooring"],
      rating: 4.8,
      reviews: 64,
      hourlyRate: 70,
      location: "Brooklyn, NY",
      distance: "6.2 miles",
      availability: "Available from Mar 28",
      verified: true,
      image: "/placeholder.svg?height=60&width=60",
      description:
        "Tile installation experts specializing in custom bathroom and kitchen backsplashes, floors, and showers.",
      yearsExperience: 15,
    },
    {
      id: 8,
      name: "Solid Foundations",
      specialty: "Concrete & Foundation",
      specialties: ["Foundation", "Concrete", "Structural"],
      rating: 4.7,
      reviews: 43,
      hourlyRate: 90,
      location: "Staten Island, NY",
      distance: "15.3 miles",
      availability: "Available from Apr 15",
      verified: false,
      image: "/placeholder.svg?height=60&width=60",
      description: "Foundation specialists handling repairs, waterproofing, and new concrete installations.",
      yearsExperience: 18,
    },
    {
      id: 9,
      name: "Green Roofing",
      specialty: "Roofing",
      specialties: ["Roofing", "Gutters", "Insulation"],
      rating: 4.4,
      reviews: 58,
      hourlyRate: 75,
      location: "Queens, NY",
      distance: "9.1 miles",
      availability: "Available from Apr 5",
      verified: true,
      image: "/placeholder.svg?height=60&width=60",
      description: "Roofing contractors offering repairs, replacements, and eco-friendly roofing options.",
      yearsExperience: 12,
    },
    {
      id: 10,
      name: "Custom Kitchens",
      specialty: "Kitchen Remodeling",
      specialties: ["Kitchen", "Cabinetry", "Countertops"],
      rating: 4.9,
      reviews: 103,
      hourlyRate: 95,
      location: "Manhattan, NY",
      distance: "4.2 miles",
      availability: "Available from May 1",
      verified: true,
      image: "/placeholder.svg?height=60&width=60",
      description: "Kitchen design and remodeling specialists with a focus on custom cabinetry and high-end finishes.",
      yearsExperience: 14,
    },
    {
      id: 11,
      name: "Flooring Experts",
      specialty: "Flooring",
      specialties: ["Flooring", "Hardwood", "Tile", "Carpet"],
      rating: 4.6,
      reviews: 87,
      hourlyRate: 65,
      location: "Brooklyn, NY",
      distance: "7.8 miles",
      availability: "Available Immediately",
      verified: true,
      image: "/placeholder.svg?height=60&width=60",
      description: "Flooring installation professionals working with hardwood, tile, laminate, vinyl, and carpet.",
      yearsExperience: 9,
    },
    {
      id: 12,
      name: "Basement Transformations",
      specialty: "Basement Finishing",
      specialties: ["Basement", "Drywall", "Flooring", "Electrical"],
      rating: 4.7,
      reviews: 52,
      hourlyRate: 80,
      location: "Queens, NY",
      distance: "8.9 miles",
      availability: "Available from Apr 20",
      verified: false,
      image: "/placeholder.svg?height=60&width=60",
      description:
        "Basement finishing specialists turning unused space into beautiful living areas, home theaters, and more.",
      yearsExperience: 11,
    },
    {
      id: 13,
      name: "Outdoor Living Designs",
      specialty: "Outdoor & Patio",
      specialties: ["Outdoor", "Decking", "Landscaping"],
      rating: 4.5,
      reviews: 68,
      hourlyRate: 70,
      location: "Long Island, NY",
      distance: "12.4 miles",
      availability: "Available from Apr 1",
      verified: true,
      image: "/placeholder.svg?height=60&width=60",
      description: "Creating beautiful outdoor living spaces including decks, patios, and landscaping.",
      yearsExperience: 8,
    },
    {
      id: 14,
      name: "Smart Home Solutions",
      specialty: "Smart Home Integration",
      specialties: ["Smart Home", "Electrical", "Security"],
      rating: 4.8,
      reviews: 41,
      hourlyRate: 85,
      location: "Manhattan, NY",
      distance: "3.5 miles",
      availability: "Available from Mar 25",
      verified: true,
      image: "/placeholder.svg?height=60&width=60",
      description: "Smart home technology experts integrating lighting, security, audio, and climate control systems.",
      yearsExperience: 6,
    },
    {
      id: 15,
      name: "Whole House Renovations",
      specialty: "Full Home Remodeling",
      specialties: ["Whole House", "Kitchen", "Bathroom", "Structural"],
      rating: 4.9,
      reviews: 35,
      hourlyRate: 110,
      location: "Brooklyn, NY",
      distance: "6.7 miles",
      availability: "Available from May 15",
      verified: true,
      image: "/placeholder.svg?height=60&width=60",
      description: "Full-service renovation company handling whole house remodels and major renovations.",
      yearsExperience: 22,
    },
  ]

  // Apply filters and sorting
  useEffect(() => {
    let results = [...contractors]

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        (contractor) =>
          contractor.name.toLowerCase().includes(term) ||
          contractor.specialty.toLowerCase().includes(term) ||
          contractor.description.toLowerCase().includes(term),
      )
    }

    // Filter by category/specialty
    if (selectedCategory !== "all") {
      results = results.filter(
        (contractor) =>
          contractor.specialty.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          contractor.specialties.some((s) => s.toLowerCase() === selectedCategory.toLowerCase()),
      )
    }

    // Filter by tab
    if (activeTab !== "all") {
      results = results.filter((contractor) =>
        contractor.specialties.some((s) => s.toLowerCase() === activeTab.toLowerCase()),
      )
    }

    // Filter by price range
    results = results.filter(
      (contractor) => contractor.hourlyRate >= priceRange[0] && contractor.hourlyRate <= priceRange[1],
    )

    // Filter by rating
    results = results.filter((contractor) => contractor.rating >= Number.parseFloat(selectedRating))

    // Filter by availability
    if (selectedAvailability !== "any") {
      if (selectedAvailability === "immediate") {
        results = results.filter((contractor) => contractor.availability.includes("Immediately"))
      } else if (selectedAvailability === "week") {
        results = results.filter(
          (contractor) =>
            contractor.availability.includes("Immediately") ||
            (contractor.availability.includes("Available from") &&
              new Date(contractor.availability.split("Available from ")[1]) <=
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        )
      } else if (selectedAvailability === "month") {
        results = results.filter(
          (contractor) =>
            contractor.availability.includes("Immediately") ||
            (contractor.availability.includes("Available from") &&
              new Date(contractor.availability.split("Available from ")[1]) <=
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        )
      }
    }

    // Sort results
    switch (sortBy) {
      case "rating":
        results.sort((a, b) => b.rating - a.rating)
        break
      case "price-low":
        results.sort((a, b) => a.hourlyRate - b.hourlyRate)
        break
      case "price-high":
        results.sort((a, b) => b.hourlyRate - a.hourlyRate)
        break
      case "distance":
        results.sort((a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance))
        break
      case "experience":
        results.sort((a, b) => b.yearsExperience - a.yearsExperience)
        break
    }

    setFilteredContractors(results)
  }, [searchTerm, selectedCategory, activeTab, priceRange, selectedRating, selectedAvailability, sortBy])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Out of Stock":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "On Order":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return ""
    }
  }

  const handleViewProfile = (contractorId: number) => {
    router.push(`/homeowner/contractors/${contractorId}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Find Contractors</h1>
        <p className="text-muted-foreground">
          Search for qualified contractors in your area for your renovation projects.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Specialty</label>
              <Select defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="kitchen">Kitchen Remodeling</SelectItem>
                  <SelectItem value="bathroom">Bathroom Remodeling</SelectItem>
                  <SelectItem value="carpentry">Carpentry</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="painting">Painting</SelectItem>
                  <SelectItem value="flooring">Flooring</SelectItem>
                  <SelectItem value="roofing">Roofing</SelectItem>
                  <SelectItem value="outdoor">Outdoor & Patio</SelectItem>
                  <SelectItem value="basement">Basement Finishing</SelectItem>
                  <SelectItem value="smart home">Smart Home</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input placeholder="Enter your zip code" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Hourly Rate</label>
                <span className="text-sm text-muted-foreground">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
              <Slider min={25} max={300} step={5} value={priceRange} onValueChange={setPriceRange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Rating</label>
              <Select defaultValue={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select minimum rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="3.5">3.5+ Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Availability</label>
              <Select defaultValue={selectedAvailability} onValueChange={setSelectedAvailability}>
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Time</SelectItem>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="week">Within a Week</SelectItem>
                  <SelectItem value="month">Within a Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full mt-2"
              onClick={() => {
                // Reset filters
                setSelectedCategory("all")
                setPriceRange([50, 200])
                setSelectedRating("3")
                setSelectedAvailability("any")
                setSearchTerm("")
              }}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>

        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contractors by name or specialty"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select defaultValue={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="distance">Closest</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="all" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="kitchen">Kitchen</TabsTrigger>
              <TabsTrigger value="bathroom">Bathroom</TabsTrigger>
              <TabsTrigger value="carpentry">Carpentry</TabsTrigger>
              <TabsTrigger value="plumbing">Plumbing</TabsTrigger>
              <TabsTrigger value="electrical">Electrical</TabsTrigger>
              <TabsTrigger value="flooring">Flooring</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredContractors.length === 0 ? (
                <Card className="p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No contractors found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters to see more results.</p>
                  <Button
                    onClick={() => {
                      setSelectedCategory("all")
                      setPriceRange([50, 200])
                      setSelectedRating("3")
                      setSelectedAvailability("any")
                      setSearchTerm("")
                      setActiveTab("all")
                    }}
                  >
                    Reset All Filters
                  </Button>
                </Card>
              ) : (
                filteredContractors.map((contractor) => (
                  <Card key={contractor.id} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="p-6 flex-1">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16 rounded-md">
                            <AvatarImage src={contractor.image} alt={contractor.name} />
                            <AvatarFallback>{contractor.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg">{contractor.name}</h3>
                              {contractor.verified && (
                                <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{contractor.specialty}</p>
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
                            <p className="text-sm mt-1">{contractor.description}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-2">
                              <span className="text-muted-foreground flex items-center">
                                <DollarSign className="mr-1 h-3 w-3" />${contractor.hourlyRate}/hr
                              </span>
                              <span className="text-muted-foreground flex items-center">
                                <MapPin className="mr-1 h-3 w-3" />
                                {contractor.distance}
                              </span>
                              <span className="text-muted-foreground flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {contractor.availability}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 sm:p-6 flex flex-row sm:flex-col gap-2 justify-end bg-muted/30 sm:border-l">
                        <Button variant="outline" size="sm" className="sm:w-32">
                          <MessageSquare className="mr-2 h-4 w-4" /> Message
                        </Button>
                        <Button size="sm" className="sm:w-32" onClick={() => handleViewProfile(contractor.id)}>
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

