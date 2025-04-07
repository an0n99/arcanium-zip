"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Progress } from "@/components/ui/progress"
import { CalendarIcon, CheckCircle2, Clock, AlertTriangle, ChevronRight, ChevronLeft } from "lucide-react"
import Link from "next/link"

type Project = {
  id: number
  name: string
  progress: number
  status: string
  contractor: string
  startDate: Date
  endDate: Date
  currentPhase: string
}

type Milestone = {
  id: number
  projectId: number
  name: string
  status: "completed" | "in-progress" | "upcoming" | "delayed"
  date: Date
  description?: string
  contractor?: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState<"calendar" | "timeline">("timeline")
  const [projectFilter, setProjectFilter] = useState<string>("all")

  // Mock data for projects
  const projects: Project[] = [
    {
      id: 1,
      name: "Kitchen Renovation",
      progress: 65,
      status: "In Progress",
      contractor: "ABC Renovations",
      startDate: new Date(2025, 0, 15), // Jan 15, 2025
      endDate: new Date(2025, 3, 30), // Apr 30, 2025
      currentPhase: "Cabinet Installation",
    },
    {
      id: 2,
      name: "Bathroom Remodel",
      progress: 30,
      status: "In Progress",
      contractor: "Modern Bathrooms Inc.",
      startDate: new Date(2025, 1, 20), // Feb 20, 2025
      endDate: new Date(2025, 3, 10), // Apr 10, 2025
      currentPhase: "Tile Installation",
    },
    {
      id: 3,
      name: "Living Room Renovation",
      progress: 0,
      status: "Not Started",
      contractor: "Elite Carpentry",
      startDate: new Date(2025, 3, 15), // Apr 15, 2025
      endDate: new Date(2025, 5, 1), // Jun 1, 2025
      currentPhase: "Planning",
    },
  ]

  // Mock data for milestones
  const milestones: Milestone[] = [
    // Kitchen Renovation Milestones
    {
      id: 1,
      projectId: 1,
      name: "Design Approval",
      status: "completed",
      date: new Date(2025, 0, 20), // Jan 20, 2025
      description: "Final design plans approved by homeowner",
      contractor: "ABC Renovations",
    },
    {
      id: 2,
      projectId: 1,
      name: "Demolition",
      status: "completed",
      date: new Date(2025, 1, 5), // Feb 5, 2025
      description: "Remove existing cabinets, countertops, and appliances",
      contractor: "ABC Renovations",
    },
    {
      id: 3,
      projectId: 1,
      name: "Plumbing & Electrical",
      status: "completed",
      date: new Date(2025, 1, 20), // Feb 20, 2025
      description: "Rough-in plumbing and electrical work",
      contractor: "ABC Renovations",
    },
    {
      id: 4,
      projectId: 1,
      name: "Cabinet Installation",
      status: "in-progress",
      date: new Date(2025, 2, 15), // Mar 15, 2025
      description: "Install new custom cabinets",
      contractor: "ABC Renovations",
    },
    {
      id: 5,
      projectId: 1,
      name: "Countertop Installation",
      status: "upcoming",
      date: new Date(2025, 2, 30), // Mar 30, 2025
      description: "Install new quartz countertops",
      contractor: "ABC Renovations",
    },
    {
      id: 6,
      projectId: 1,
      name: "Backsplash & Finishing",
      status: "upcoming",
      date: new Date(2025, 3, 15), // Apr 15, 2025
      description: "Install backsplash and complete finishing touches",
      contractor: "ABC Renovations",
    },
    {
      id: 7,
      projectId: 1,
      name: "Final Inspection",
      status: "upcoming",
      date: new Date(2025, 3, 25), // Apr 25, 2025
      description: "Final walkthrough and inspection",
      contractor: "ABC Renovations",
    },

    // Bathroom Remodel Milestones
    {
      id: 8,
      projectId: 2,
      name: "Design Approval",
      status: "completed",
      date: new Date(2025, 1, 25), // Feb 25, 2025
      description: "Final design plans approved by homeowner",
      contractor: "Modern Bathrooms Inc.",
    },
    {
      id: 9,
      projectId: 2,
      name: "Demolition",
      status: "completed",
      date: new Date(2025, 2, 5), // Mar 5, 2025
      description: "Remove existing fixtures, tile, and vanity",
      contractor: "Modern Bathrooms Inc.",
    },
    {
      id: 10,
      projectId: 2,
      name: "Plumbing Rough-In",
      status: "in-progress",
      date: new Date(2025, 2, 15), // Mar 15, 2025
      description: "Rough-in plumbing for new fixtures",
      contractor: "Modern Bathrooms Inc.",
    },
    {
      id: 11,
      projectId: 2,
      name: "Tile Installation",
      status: "upcoming",
      date: new Date(2025, 2, 25), // Mar 25, 2025
      description: "Install new floor and wall tile",
      contractor: "Modern Bathrooms Inc.",
    },
    {
      id: 12,
      projectId: 2,
      name: "Fixture Installation",
      status: "upcoming",
      date: new Date(2025, 3, 5), // Apr 5, 2025
      description: "Install new vanity, toilet, and shower fixtures",
      contractor: "Modern Bathrooms Inc.",
    },

    // Living Room Renovation Milestones
    {
      id: 13,
      projectId: 3,
      name: "Design Consultation",
      status: "upcoming",
      date: new Date(2025, 3, 15), // Apr 15, 2025
      description: "Initial design consultation with contractor",
      contractor: "Elite Carpentry",
    },
    {
      id: 14,
      projectId: 3,
      name: "Material Selection",
      status: "upcoming",
      date: new Date(2025, 3, 25), // Apr 25, 2025
      description: "Select materials and finishes",
      contractor: "Elite Carpentry",
    },
  ]

  // Filter milestones based on selected project
  const filteredMilestones = milestones
    .filter((milestone) => projectFilter === "all" || milestone.projectId.toString() === projectFilter)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  // Get milestones for selected date
  const selectedDateMilestones = milestones.filter(
    (milestone) =>
      selectedDate &&
      milestone.date.getDate() === selectedDate.getDate() &&
      milestone.date.getMonth() === selectedDate.getMonth() &&
      milestone.date.getFullYear() === selectedDate.getFullYear(),
  )

  // Get dates with milestones for calendar highlighting
  const milestoneDates = milestones.map((milestone) => ({
    date: milestone.date,
    status: milestone.status,
  }))

  const getStatusColor = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "upcoming":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      case "delayed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return ""
    }
  }

  const getStatusIcon = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "upcoming":
        return <CalendarIcon className="h-5 w-5 text-gray-500" />
      case "delayed":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // Get day name
  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long" })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Timeline</h1>
          <p className="text-muted-foreground">Track milestones and schedules for your renovation projects.</p>
        </div>
        <div className="flex gap-2">
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex rounded-md overflow-hidden">
            <Button
              variant={view === "timeline" ? "default" : "outline"}
              className="rounded-r-none"
              onClick={() => setView("timeline")}
            >
              Timeline
            </Button>
            <Button
              variant={view === "calendar" ? "default" : "outline"}
              className="rounded-l-none"
              onClick={() => setView("calendar")}
            >
              Calendar
            </Button>
          </div>
        </div>
      </div>

      {view === "timeline" ? (
        <div className="space-y-8">
          {projects
            .filter((project) => projectFilter === "all" || project.id.toString() === projectFilter)
            .map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>
                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{project.status}</Badge>
                      <span className="text-sm font-medium">{project.progress}% Complete</span>
                    </div>
                  </div>
                  <Progress value={project.progress} className="h-2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Current Phase:</span>
                      <span>{project.currentPhase}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Contractor:</span>
                      <span>{project.contractor}</span>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Milestones</h3>
                      <div className="relative">
                        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted-foreground/20"></div>
                        <div className="space-y-8">
                          {milestones
                            .filter((milestone) => milestone.projectId === project.id)
                            .sort((a, b) => a.date.getTime() - b.date.getTime())
                            .map((milestone, index) => (
                              <div key={milestone.id} className="relative pl-10">
                                <div className="absolute left-0 top-1 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-background">
                                  {getStatusIcon(milestone.status)}
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                                  <div>
                                    <h4 className="font-medium">{milestone.name}</h4>
                                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(milestone.status)}>
                                      {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                                    </Badge>
                                    <span className="text-sm whitespace-nowrap">{formatDate(milestone.date)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Calendar View</CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newDate = new Date(currentDate)
                      newDate.setMonth(newDate.getMonth() - 1)
                      setCurrentDate(newDate)
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newDate = new Date(currentDate)
                      newDate.setMonth(newDate.getMonth() + 1)
                      setCurrentDate(newDate)
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentDate}
                className="rounded-md border"
                modifiers={{
                  milestone: milestoneDates.map((m) => m.date),
                  completed: milestoneDates.filter((m) => m.status === "completed").map((m) => m.date),
                  inProgress: milestoneDates.filter((m) => m.status === "in-progress").map((m) => m.date),
                  upcoming: milestoneDates.filter((m) => m.status === "upcoming").map((m) => m.date),
                  delayed: milestoneDates.filter((m) => m.status === "delayed").map((m) => m.date),
                }}
                modifiersClassNames={{
                  milestone: "font-bold",
                  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                  inProgress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
                  upcoming: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
                  delayed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate ? (
                  <div>
                    <div className="text-lg">{formatDate(selectedDate)}</div>
                    <div className="text-sm text-muted-foreground">{getDayName(selectedDate)}</div>
                  </div>
                ) : (
                  "Select a Date"
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateMilestones.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateMilestones.map((milestone) => {
                    const project = projects.find((p) => p.id === milestone.projectId)
                    return (
                      <div key={milestone.id} className="border rounded-lg p-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getStatusIcon(milestone.status)}</div>
                          <div className="space-y-1">
                            <div className="font-medium">{milestone.name}</div>
                            <div className="text-sm text-muted-foreground">{milestone.description}</div>
                            <div className="text-xs">
                              <span className="font-medium">Project: </span>
                              <Link
                                href={`/homeowner/projects/${project?.id}`}
                                className="text-primary hover:underline"
                              >
                                {project?.name}
                              </Link>
                            </div>
                            <div className="text-xs">
                              <span className="font-medium">Contractor: </span>
                              <span>{milestone.contractor}</span>
                            </div>
                            <Badge className={`mt-2 ${getStatusColor(milestone.status)}`}>
                              {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  {selectedDate ? "No milestones scheduled for this date" : "Select a date to view milestones"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

