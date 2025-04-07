"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  CalendarIcon,
  Upload,
  Check,
  Loader2,
  Sparkles,
  Wrench,
  PaintBucket,
  Clock,
  DollarSign,
  FileText,
  Trash2,
  Building,
  CheckCircle2,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  projectName: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  roomType: z.string({
    required_error: "Please select a room type.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  budget: z.number().min(1000, {
    message: "Budget must be at least $1,000.",
  }),
  startDate: z.date({
    required_error: "Please select a start date.",
  }),
  endDate: z.date({
    required_error: "Please select an end date.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  zipCode: z.string().min(5, {
    message: "ZIP code must be at least 5 characters.",
  }),
})

export default function CreateProjectPage() {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState("details")
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projectCreated, setProjectCreated] = useState(false)
  const [isGeneratingScope, setIsGeneratingScope] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedScope, setGeneratedScope] = useState<any>(null)
  const [scopeAdjustments, setScopeAdjustments] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      description: "",
      budget: 10000,
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  })

  // Simulate AI scope generation
  const generateAIScope = async () => {
    setIsGeneratingScope(true)
    setGenerationProgress(0)

    // Simulate progress updates
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        const newProgress = prev + Math.random() * 15
        return newProgress >= 100 ? 100 : newProgress
      })
    }, 300)

    // Simulate API call with a timeout
    await new Promise((resolve) => setTimeout(resolve, 3500))

    clearInterval(interval)
    setGenerationProgress(100)

    // Generate scope based on form data
    const formData = form.getValues()
    const roomType = formData.roomType || "renovation"
    const budget = formData.budget || 10000

    // Create a scope object based on the room type
    const scope: any = {
      demolition: [],
      construction: [],
      finishing: [],
      timeline: "",
      budget: budget,
      estimatedCosts: {}, // Add this line
      materials: [],
    }

    // Add items based on room type
    switch (roomType) {
      case "kitchen":
        scope.demolition = [
          "Remove existing cabinets and countertops",
          "Remove appliances",
          "Remove flooring if necessary",
          "Remove backsplash",
        ]
        scope.construction = [
          "Install new custom cabinetry",
          "Install countertops",
          "Update plumbing fixtures",
          "Install new lighting fixtures",
          "Install new flooring",
        ]
        scope.finishing = [
          "Paint walls and trim",
          "Install backsplash",
          "Install new appliances",
          "Final electrical and plumbing connections",
        ]
        scope.timeline = "4-6 weeks"
        scope.materials = [
          { name: "Cabinets", quantity: "10 units", cost: Math.round(budget * 0.25) },
          { name: "Countertops", quantity: "30 sq ft", cost: Math.round(budget * 0.15) },
          { name: "Flooring", quantity: "200 sq ft", cost: Math.round(budget * 0.1) },
          { name: "Appliances", quantity: "4 units", cost: Math.round(budget * 0.2) },
          { name: "Fixtures", quantity: "Various", cost: Math.round(budget * 0.05) },
        ]
        break

      case "bathroom":
        scope.demolition = ["Remove existing fixtures", "Remove tile and flooring", "Remove vanity and toilet"]
        scope.construction = [
          "Install new shower/tub",
          "Install new vanity and toilet",
          "Update plumbing fixtures",
          "Install new lighting",
          "Install new tile flooring and walls",
        ]
        scope.finishing = [
          "Paint walls and trim",
          "Install mirrors and accessories",
          "Caulk and seal all fixtures",
          "Final plumbing connections",
        ]
        scope.timeline = "3-4 weeks"
        scope.materials = [
          { name: "Shower/Tub", quantity: "1 unit", cost: Math.round(budget * 0.2) },
          { name: "Vanity", quantity: "1 unit", cost: Math.round(budget * 0.15) },
          { name: "Toilet", quantity: "1 unit", cost: Math.round(budget * 0.05) },
          { name: "Tile", quantity: "100 sq ft", cost: Math.round(budget * 0.15) },
          { name: "Fixtures", quantity: "Various", cost: Math.round(budget * 0.1) },
        ]
        break

      case "bedroom":
        scope.demolition = ["Remove existing flooring if necessary", "Remove old fixtures and fittings"]
        scope.construction = [
          "Install new flooring",
          "Update electrical fixtures",
          "Build any custom storage solutions",
        ]
        scope.finishing = ["Paint walls and trim", "Install new fixtures", "Install window treatments"]
        scope.timeline = "2-3 weeks"
        scope.materials = [
          { name: "Flooring", quantity: "150 sq ft", cost: Math.round(budget * 0.3) },
          { name: "Paint", quantity: "5 gallons", cost: Math.round(budget * 0.1) },
          { name: "Fixtures", quantity: "Various", cost: Math.round(budget * 0.15) },
          { name: "Window Treatments", quantity: "2-3 units", cost: Math.round(budget * 0.1) },
        ]
        break

      case "livingRoom":
        scope.demolition = ["Remove existing flooring if necessary", "Remove old fixtures and fittings"]
        scope.construction = [
          "Install new flooring",
          "Update electrical fixtures",
          "Build any custom features (built-ins, etc.)",
        ]
        scope.finishing = ["Paint walls and trim", "Install new fixtures", "Install window treatments"]
        scope.timeline = "2-3 weeks"
        scope.materials = [
          { name: "Flooring", quantity: "300 sq ft", cost: Math.round(budget * 0.35) },
          { name: "Paint", quantity: "8 gallons", cost: Math.round(budget * 0.1) },
          { name: "Fixtures", quantity: "Various", cost: Math.round(budget * 0.15) },
          { name: "Custom Features", quantity: "As needed", cost: Math.round(budget * 0.2) },
        ]
        break

      case "basement":
        scope.demolition = ["Clear out existing space", "Remove any old framing or fixtures"]
        scope.construction = [
          "Waterproofing if necessary",
          "Framing walls",
          "Electrical and plumbing rough-ins",
          "Insulation and drywall",
          "Flooring installation",
        ]
        scope.finishing = [
          "Paint walls and trim",
          "Install fixtures and lighting",
          "Install doors and trim",
          "Final electrical and plumbing connections",
        ]
        scope.timeline = "6-8 weeks"
        scope.materials = [
          { name: "Framing Lumber", quantity: "As needed", cost: Math.round(budget * 0.15) },
          { name: "Drywall", quantity: "500 sq ft", cost: Math.round(budget * 0.1) },
          { name: "Insulation", quantity: "500 sq ft", cost: Math.round(budget * 0.05) },
          { name: "Flooring", quantity: "400 sq ft", cost: Math.round(budget * 0.2) },
          { name: "Electrical", quantity: "Complete system", cost: Math.round(budget * 0.15) },
          { name: "Plumbing", quantity: "As needed", cost: Math.round(budget * 0.1) },
        ]
        break

      case "outdoor":
        scope.demolition = ["Clear existing space", "Remove old structures if necessary"]
        scope.construction = [
          "Prepare foundation/ground",
          "Build new structures",
          "Install electrical if needed",
          "Install plumbing if needed",
        ]
        scope.finishing = [
          "Install decking/patio materials",
          "Landscaping",
          "Install fixtures and lighting",
          "Final touches and cleanup",
        ]
        scope.timeline = "3-5 weeks"
        scope.materials = [
          { name: "Decking/Patio", quantity: "300 sq ft", cost: Math.round(budget * 0.4) },
          { name: "Landscaping", quantity: "As needed", cost: Math.round(budget * 0.2) },
          { name: "Outdoor Fixtures", quantity: "Various", cost: Math.round(budget * 0.15) },
          { name: "Lighting", quantity: "10-15 units", cost: Math.round(budget * 0.1) },
        ]
        break

      case "wholeHouse":
        scope.demolition = [
          "Selective demolition throughout house",
          "Remove old fixtures, cabinets, and appliances",
          "Remove flooring and wall coverings as needed",
        ]
        scope.construction = [
          "Structural modifications if needed",
          "Plumbing and electrical updates",
          "New drywall and insulation where needed",
          "New flooring throughout",
          "New kitchen and bathroom fixtures",
        ]
        scope.finishing = [
          "Paint throughout",
          "Install trim and doors",
          "Install fixtures and appliances",
          "Final electrical and plumbing connections",
          "Thorough cleaning",
        ]
        scope.timeline = "8-12 weeks"
        scope.materials = [
          { name: "Flooring", quantity: "1500 sq ft", cost: Math.round(budget * 0.2) },
          { name: "Drywall", quantity: "As needed", cost: Math.round(budget * 0.05) },
          { name: "Paint", quantity: "20 gallons", cost: Math.round(budget * 0.05) },
          { name: "Kitchen Materials", quantity: "Complete set", cost: Math.round(budget * 0.25) },
          { name: "Bathroom Materials", quantity: "Complete set", cost: Math.round(budget * 0.15) },
          { name: "Fixtures & Appliances", quantity: "Various", cost: Math.round(budget * 0.15) },
        ]
        break

      default:
        scope.demolition = ["Remove existing fixtures and fittings", "Prepare surfaces for new installations"]
        scope.construction = ["Install new fixtures", "Update as needed"]
        scope.finishing = ["Paint and finish surfaces", "Clean-up and debris removal"]
        scope.timeline = "2-4 weeks"
        scope.materials = [
          { name: "General Materials", quantity: "As needed", cost: Math.round(budget * 0.6) },
          { name: "Fixtures", quantity: "Various", cost: Math.round(budget * 0.2) },
        ]
    }

    // Add some budget-based customizations
    if (budget > 25000) {
      scope.construction.push("Premium material upgrades")
      scope.finishing.push("Designer finishing touches")
    }

    if (budget > 50000) {
      scope.construction.push("Structural improvements if needed")
      scope.finishing.push("Smart home integration")
    }

    // Add cost estimates
    scope.estimatedCosts = {
      demolition: Math.round(budget * 0.1),
      construction: Math.round(budget * 0.6),
      finishing: Math.round(budget * 0.3),
      total: budget,
      labor: Math.round(budget * 0.4),
      materials: Math.round(budget * 0.5),
      permits: Math.round(budget * 0.05),
      contingency: Math.round(budget * 0.05),
    }

    setGeneratedScope(scope)
    setIsGeneratingScope(false)
  }

  useEffect(() => {
    // If we're on the scope tab and haven't generated a scope yet, start generation
    if (currentTab === "scope" && !generatedScope && !isGeneratingScope) {
      generateAIScope()
    }
  }, [currentTab, generatedScope, isGeneratingScope])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (currentTab === "details") {
      setCurrentTab("photos")
    } else if (currentTab === "photos") {
      setCurrentTab("scope")
    } else if (currentTab === "scope") {
      // Final submission
      setIsSubmitting(true)

      try {
        // Simulate API call with a timeout
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Create a new project object
        const newProject = {
          id: Math.floor(Math.random() * 10000),
          ...values,
          progress: 0,
          status: "Draft",
          createdAt: new Date().toISOString(),
          files: files.map((file) => file.name),
          scope: generatedScope,
          scopeAdjustments,
        }

        // In a real app, you would send this to your API
        console.log("New project created:", newProject)

        // Show success message
        setProjectCreated(true)
        toast({
          title: "Project created successfully!",
          description: `Your project "${values.projectName}" has been created.`,
        })

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/homeowner/dashboard")
        }, 2000)
      } catch (error) {
        console.error("Error creating project:", error)
        toast({
          title: "Error creating project",
          description: "There was an error creating your project. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  // Function to get room type display name
  const getRoomTypeDisplay = (type: string) => {
    const types: Record<string, string> = {
      kitchen: "Kitchen",
      bathroom: "Bathroom",
      bedroom: "Bedroom",
      livingRoom: "Living Room",
      basement: "Basement",
      outdoor: "Outdoor/Patio",
      wholeHouse: "Whole House",
    }
    return types[type] || "Renovation"
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Project</h1>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="photos">Photos & Inspiration</TabsTrigger>
          <TabsTrigger value="scope">AI-Generated Scope</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Enter the basic information about your renovation project.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Kitchen Renovation" {...field} />
                        </FormControl>
                        <FormDescription>Give your project a descriptive name.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="roomType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a room type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="kitchen">Kitchen</SelectItem>
                            <SelectItem value="bathroom">Bathroom</SelectItem>
                            <SelectItem value="bedroom">Bedroom</SelectItem>
                            <SelectItem value="livingRoom">Living Room</SelectItem>
                            <SelectItem value="basement">Basement</SelectItem>
                            <SelectItem value="outdoor">Outdoor/Patio</SelectItem>
                            <SelectItem value="wholeHouse">Whole House</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the type of room you're renovating.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what you want to change about your space..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Provide details about what you want to change or improve.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Project Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget (USD)</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Slider
                              min={1000}
                              max={100000}
                              step={1000}
                              defaultValue={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">$1,000</span>
                              <span className="text-sm font-medium">${field.value.toLocaleString()}</span>
                              <span className="text-sm text-muted-foreground">$100,000</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>Set your estimated budget for this project.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Target Completion</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() || (form.watch("startDate") && date < form.watch("startDate"))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Continue to Photos
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <CardTitle>Photos & Inspiration</CardTitle>
              <CardDescription>Upload photos of your current space and any inspiration images.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <h3 className="font-medium text-lg">Drag & Drop Files</h3>
                    <p className="text-sm text-muted-foreground">or click to browse files on your device</p>
                    <Input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                      Select Files
                    </Button>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Selected Files ({files.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {files.map((file, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                          <img
                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                            alt={`Uploaded file ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentTab("details")}>
                Back to Details
              </Button>
              <Button onClick={() => form.handleSubmit(onSubmit)()}>Continue to Scope</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="scope">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI-Generated Scope
                  </CardTitle>
                  <CardDescription>
                    Based on your inputs, we've generated a detailed project scope and cost estimate.
                  </CardDescription>
                </div>
                {generatedScope && (
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    {getRoomTypeDisplay(form.watch("roomType") || "renovation")}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isGeneratingScope ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    <h3 className="font-medium">Generating AI Scope...</h3>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Our AI is analyzing your project details and creating a customized scope of work...
                  </p>
                  <div className="rounded-md bg-muted p-4 animate-pulse">
                    <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-muted-foreground/20 rounded w-5/6 mb-2"></div>
                    <div className="h-4 bg-muted-foreground/20 rounded w-2/3 mb-2"></div>
                  </div>
                </div>
              ) : generatedScope ? (
                <div className="space-y-6">
                  {/* Project Overview Card */}
                  <div className="bg-muted rounded-lg overflow-hidden border">
                    <div className="bg-primary/10 p-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Project Overview
                      </h3>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Project Type</p>
                        <p className="font-medium">{getRoomTypeDisplay(form.watch("roomType") || "renovation")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Timeline</p>
                        <p className="font-medium flex items-center gap-1">
                          <Clock className="h-4 w-4 text-primary" />
                          {generatedScope.timeline}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
                        <p className="font-medium flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-primary" />${generatedScope.budget.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                        <p className="font-medium">
                          {form.watch("startDate") ? format(form.watch("startDate"), "PPP") : "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cost Breakdown Card */}
                  <div className="bg-muted rounded-lg overflow-hidden border">
                    <div className="bg-primary/10 p-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        Cost Breakdown
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-background p-3 rounded-md border">
                          <p className="text-sm text-muted-foreground">Labor</p>
                          <p className="text-lg font-semibold">
                            ${generatedScope.estimatedCosts.labor.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round((generatedScope.estimatedCosts.labor / generatedScope.budget) * 100)}% of budget
                          </p>
                        </div>
                        <div className="bg-background p-3 rounded-md border">
                          <p className="text-sm text-muted-foreground">Materials</p>
                          <p className="text-lg font-semibold">
                            ${generatedScope.estimatedCosts.materials.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round((generatedScope.estimatedCosts.materials / generatedScope.budget) * 100)}% of
                            budget
                          </p>
                        </div>
                        <div className="bg-background p-3 rounded-md border">
                          <p className="text-sm text-muted-foreground">Permits & Fees</p>
                          <p className="text-lg font-semibold">
                            ${generatedScope.estimatedCosts.permits.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round((generatedScope.estimatedCosts.permits / generatedScope.budget) * 100)}% of
                            budget
                          </p>
                        </div>
                        <div className="bg-background p-3 rounded-md border">
                          <p className="text-sm text-muted-foreground">Contingency</p>
                          <p className="text-lg font-semibold">
                            ${generatedScope.estimatedCosts.contingency.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round((generatedScope.estimatedCosts.contingency / generatedScope.budget) * 100)}% of
                            budget
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Phase Breakdown</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span>Demolition</span>
                            </div>
                            <span className="font-medium">
                              ${generatedScope.estimatedCosts.demolition.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={10} className="h-2" />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-blue-500" />
                              <span>Construction</span>
                            </div>
                            <span className="font-medium">
                              ${generatedScope.estimatedCosts.construction.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={60} className="h-2" />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <PaintBucket className="h-4 w-4 text-green-500" />
                              <span>Finishing</span>
                            </div>
                            <span className="font-medium">
                              ${generatedScope.estimatedCosts.finishing.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={30} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Materials Estimate */}
                  <div className="bg-muted rounded-lg overflow-hidden border">
                    <div className="bg-primary/10 p-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-primary" />
                        Materials Estimate
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-2 text-sm font-medium">Material</th>
                              <th className="text-left py-2 px-2 text-sm font-medium">Quantity</th>
                              <th className="text-right py-2 px-2 text-sm font-medium">Est. Cost</th>
                            </tr>
                          </thead>
                          <tbody>
                            {generatedScope.materials.map((material: any, index: number) => (
                              <tr key={index} className="border-b last:border-0">
                                <td className="py-2 px-2">{material.name}</td>
                                <td className="py-2 px-2">{material.quantity}</td>
                                <td className="py-2 px-2 text-right">${material.cost.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Scope of Work */}
                  <div className="bg-muted rounded-lg overflow-hidden border">
                    <div className="bg-primary/10 p-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        Scope of Work
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <Trash2 className="h-4 w-4 text-red-500" />
                            Demolition & Preparation
                          </h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {generatedScope.demolition.map((item: string, index: number) => (
                              <li key={`demo-${index}`} className="text-sm">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <Building className="h-4 w-4 text-blue-500" />
                            Construction & Installation
                          </h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {generatedScope.construction.map((item: string, index: number) => (
                              <li key={`const-${index}`} className="text-sm">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <PaintBucket className="h-4 w-4 text-green-500" />
                            Finishing
                          </h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {generatedScope.finishing.map((item: string, index: number) => (
                              <li key={`finish-${index}`} className="text-sm">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-md bg-muted p-4 text-center">
                  <p>No scope generated yet. Please complete the previous steps first.</p>
                </div>
              )}

              <div className="mt-6">
                <h3 className="font-medium mb-2">Adjust Scope (Optional)</h3>
                <Textarea
                  placeholder="Add any additional details or adjustments to the scope..."
                  className="min-h-[120px]"
                  value={scopeAdjustments}
                  onChange={(e) => setScopeAdjustments(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentTab("photos")}>
                Back to Photos
              </Button>
              <Button
                onClick={() => form.handleSubmit(onSubmit)()}
                disabled={isSubmitting || projectCreated || isGeneratingScope}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Project...
                  </>
                ) : projectCreated ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Project Created!
                  </>
                ) : isGeneratingScope ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Scope...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

