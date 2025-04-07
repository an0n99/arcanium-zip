"use client"

import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { CalendarIcon, Upload } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useState } from "react"

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
})

export default function CreateProjectPage() {
  const [currentTab, setCurrentTab] = useState("details")
  const [files, setFiles] = useState<File[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      description: "",
      budget: 10000,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Here you would typically send the data to your backend
    // For now, we'll just move to the next tab
    if (currentTab === "details") {
      setCurrentTab("photos")
    } else if (currentTab === "photos") {
      setCurrentTab("scope")
    } else if (currentTab === "scope") {
      // Final submission would happen here
      console.log("Final submission with files:", files)
      // Redirect to dashboard or project page
      window.location.href = "/dashboard"
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
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

                  <div className="grid grid-cols-2 gap-4">
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
              <CardTitle>AI-Generated Scope</CardTitle>
              <CardDescription>
                Based on your inputs, we've generated a project scope. Review and adjust as needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-medium mb-2">Project Scope</h3>
                  <div className="space-y-4 text-sm">
                    <p>
                      Based on your description and photos, we recommend the following scope of work for your{" "}
                      {form.watch("roomType") || "renovation"} project:
                    </p>

                    <div className="space-y-2">
                      <h4 className="font-medium">Demolition & Preparation</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Remove existing fixtures and appliances</li>
                        <li>Demolish outdated cabinetry and countertops</li>
                        <li>Prepare surfaces for new installations</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Construction & Installation</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Install new custom cabinetry</li>
                        <li>Install quartz countertops</li>
                        <li>Update plumbing fixtures</li>
                        <li>Install new lighting fixtures</li>
                        <li>Install new flooring</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Finishing</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Paint walls and trim</li>
                        <li>Install backsplash</li>
                        <li>Final electrical and plumbing connections</li>
                        <li>Clean-up and debris removal</li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <p className="font-medium">Estimated Timeline: 4-6 weeks</p>
                      <p className="font-medium">
                        Estimated Budget: ${form.watch("budget")?.toLocaleString() || "10,000"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Adjust Scope (Optional)</h3>
                  <Textarea
                    placeholder="Add any additional details or adjustments to the scope..."
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentTab("photos")}>
                Back to Photos
              </Button>
              <Button onClick={() => form.handleSubmit(onSubmit)()}>Create Project</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

