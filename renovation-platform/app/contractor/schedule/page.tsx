"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format, addDays, isSameDay, parseISO, startOfDay } from "date-fns"
import { CalendarIcon, Clock, MapPin, Plus, User, X, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for appointments
const initialAppointments = [
  {
    id: 1,
    title: "Initial Consultation",
    client: "John Smith",
    clientId: "client-001",
    project: "Kitchen Renovation",
    projectId: "project-001",
    date: "2025-03-10T09:00:00",
    endTime: "2025-03-10T10:30:00",
    location: "123 Main St, Boston, MA",
    description: "Discuss project requirements and take measurements.",
    status: "scheduled",
  },
  {
    id: 2,
    title: "Material Selection",
    client: "Emily Johnson",
    clientId: "client-002",
    project: "Bathroom Remodel",
    projectId: "project-002",
    date: "2025-03-12T13:00:00",
    endTime: "2025-03-12T15:00:00",
    location: "456 Oak Ave, Cambridge, MA",
    description: "Help client select tiles, fixtures, and finishes.",
    status: "scheduled",
  },
  {
    id: 3,
    title: "Project Kickoff",
    client: "Michael Brown",
    clientId: "client-003",
    project: "Basement Finishing",
    projectId: "project-003",
    date: "2025-03-15T08:00:00",
    endTime: "2025-03-15T09:00:00",
    location: "789 Pine St, Somerville, MA",
    description: "Meet with client to start the project and confirm timeline.",
    status: "scheduled",
  },
  {
    id: 4,
    title: "Cabinet Installation",
    client: "John Smith",
    clientId: "client-001",
    project: "Kitchen Renovation",
    projectId: "project-001",
    date: "2025-03-20T08:00:00",
    endTime: "2025-03-20T17:00:00",
    location: "123 Main St, Boston, MA",
    description: "Install new kitchen cabinets.",
    status: "scheduled",
  },
  {
    id: 5,
    title: "Final Inspection",
    client: "Sarah Wilson",
    clientId: "client-004",
    project: "Deck Construction",
    projectId: "project-004",
    date: "2025-03-22T14:00:00",
    endTime: "2025-03-22T15:00:00",
    location: "321 Elm St, Brookline, MA",
    description: "Final walkthrough and inspection of completed deck.",
    status: "scheduled",
  },
]

// Mock data for milestones and payment days
const initialMilestones = [
  {
    id: 1,
    projectId: "project-001",
    projectName: "Kitchen Renovation",
    title: "Design Approval",
    date: "2025-03-05T00:00:00",
    description: "Client approves final design plans",
    status: "completed",
    client: "John Smith",
  },
  {
    id: 2,
    projectId: "project-001",
    projectName: "Kitchen Renovation",
    title: "Demolition Complete",
    date: "2025-03-12T00:00:00",
    description: "Removal of existing cabinets and countertops",
    status: "completed",
    client: "John Smith",
  },
  {
    id: 3,
    projectId: "project-001",
    projectName: "Kitchen Renovation",
    title: "Cabinet Installation",
    date: "2025-03-25T00:00:00",
    description: "Installation of new custom cabinets",
    status: "upcoming",
    client: "John Smith",
  },
  {
    id: 4,
    projectId: "project-002",
    projectName: "Bathroom Remodel",
    title: "Plumbing Rough-In",
    date: "2025-03-18T00:00:00",
    description: "Complete plumbing rough-in work",
    status: "upcoming",
    client: "Emily Johnson",
  },
  {
    id: 5,
    projectId: "project-003",
    projectName: "Basement Finishing",
    title: "Framing Inspection",
    date: "2025-03-30T00:00:00",
    description: "Inspection of framing work",
    status: "upcoming",
    client: "Michael Brown",
  },
]

const initialPayments = [
  {
    id: 1,
    projectId: "project-001",
    projectName: "Kitchen Renovation",
    title: "Deposit Payment",
    amount: 5000,
    date: "2025-03-01T00:00:00",
    status: "paid",
    client: "John Smith",
  },
  {
    id: 2,
    projectId: "project-001",
    projectName: "Kitchen Renovation",
    title: "Progress Payment 1",
    amount: 7500,
    date: "2025-03-15T00:00:00",
    status: "paid",
    client: "John Smith",
  },
  {
    id: 3,
    projectId: "project-001",
    projectName: "Kitchen Renovation",
    title: "Final Payment",
    amount: 7500,
    date: "2025-04-05T00:00:00",
    status: "upcoming",
    client: "John Smith",
  },
  {
    id: 4,
    projectId: "project-002",
    projectName: "Bathroom Remodel",
    title: "Deposit Payment",
    amount: 3000,
    date: "2025-02-25T00:00:00",
    status: "paid",
    client: "Emily Johnson",
  },
  {
    id: 5,
    projectId: "project-002",
    projectName: "Bathroom Remodel",
    title: "Final Payment",
    amount: 7000,
    date: "2025-04-10T00:00:00",
    status: "upcoming",
    client: "Emily Johnson",
  },
]

// Status mapping for display
const statusMap = {
  scheduled: { label: "Scheduled", color: "bg-blue-500" },
  completed: { label: "Completed", color: "bg-green-500" },
  cancelled: { label: "Cancelled", color: "bg-red-500" },
}

export default function ContractorSchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [appointments, setAppointments] = useState(initialAppointments)
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    client: "",
    project: "",
    date: "",
    endTime: "",
    location: "",
    description: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState("day")
  const { toast } = useToast()

  const [milestones, setMilestones] = useState(initialMilestones)
  const [payments, setPayments] = useState(initialPayments)
  const [activeTab, setActiveTab] = useState("appointments")

  // Get appointments for the selected date
  const getAppointmentsForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return []

    return appointments.filter((appointment) => {
      const appointmentDate = parseISO(appointment.date)
      return isSameDay(appointmentDate, selectedDate)
    })
  }

  // Get appointments for the selected week
  const getAppointmentsForWeek = (selectedDate: Date | undefined) => {
    if (!selectedDate) return []

    const startDate = startOfDay(selectedDate)
    const endDate = addDays(startDate, 6)

    return appointments.filter((appointment) => {
      const appointmentDate = parseISO(appointment.date)
      return appointmentDate >= startDate && appointmentDate <= endDate
    })
  }

  // Add this function to get milestones for the selected date
  const getMilestonesForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return []

    return milestones.filter((milestone) => {
      const milestoneDate = parseISO(milestone.date)
      return isSameDay(milestoneDate, selectedDate)
    })
  }

  // Add this function to get payments for the selected date
  const getPaymentsForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return []

    return payments.filter((payment) => {
      const paymentDate = parseISO(payment.date)
      return isSameDay(paymentDate, selectedDate)
    })
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewAppointment((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!newAppointment.title || !newAppointment.date || !newAppointment.client) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Create new appointment
    const newId = Math.max(...appointments.map((a) => a.id), 0) + 1
    const createdAppointment = {
      id: newId,
      ...newAppointment,
      clientId: `client-${newId}`,
      projectId: `project-${newId}`,
      status: "scheduled",
    }

    // Add to appointments
    setAppointments((prev) => [...prev, createdAppointment])

    // Reset form and close dialog
    setNewAppointment({
      title: "",
      client: "",
      project: "",
      date: "",
      endTime: "",
      location: "",
      description: "",
    })
    setIsDialogOpen(false)

    toast({
      title: "Appointment Created",
      description: "Your new appointment has been scheduled.",
    })
  }

  // Handle appointment status change
  const handleStatusChange = (id: number, newStatus: string) => {
    setAppointments((prev) =>
      prev.map((appointment) => (appointment.id === id ? { ...appointment, status: newStatus } : appointment)),
    )

    toast({
      title: `Appointment ${newStatus === "completed" ? "Completed" : "Cancelled"}`,
      description: `The appointment has been marked as ${newStatus}.`,
    })
  }

  // Format time from ISO string
  const formatTime = (isoString: string) => {
    return format(parseISO(isoString), "h:mm a")
  }

  // Get day name
  const getDayName = (date: Date) => {
    return format(date, "EEEE")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground">Manage your appointments and project timeline.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Appointment</DialogTitle>
                <DialogDescription>
                  Create a new appointment for your schedule. Fill in all the required information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title*</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newAppointment.title}
                    onChange={handleInputChange}
                    placeholder="Appointment title"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date & Time*</Label>
                    <Input
                      id="date"
                      name="date"
                      type="datetime-local"
                      value={newAppointment.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="datetime-local"
                      value={newAppointment.endTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="client">Client*</Label>
                  <Input
                    id="client"
                    name="client"
                    value={newAppointment.client}
                    onChange={handleInputChange}
                    placeholder="Client name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project">Project</Label>
                  <Input
                    id="project"
                    name="project"
                    value={newAppointment.project}
                    onChange={handleInputChange}
                    placeholder="Related project"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={newAppointment.location}
                    onChange={handleInputChange}
                    placeholder="Appointment location"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newAppointment.description}
                    onChange={handleInputChange}
                    placeholder="Additional details"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Appointment</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Upcoming</CardTitle>
              <CardDescription>Your next 3 appointments</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                {appointments
                  .filter((a) => parseISO(a.date) >= new Date() && a.status === "scheduled")
                  .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
                  .slice(0, 3)
                  .map((appointment) => (
                    <div key={appointment.id} className="flex items-start gap-2 rounded-md border p-2">
                      <CalendarIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{appointment.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(appointment.date), "MMM d, yyyy")} at {formatTime(appointment.date)}
                        </p>
                        <p className="text-xs">{appointment.client}</p>
                      </div>
                    </div>
                  ))}
                {appointments.filter((a) => parseISO(a.date) >= new Date() && a.status === "scheduled").length ===
                  0 && <p className="text-sm text-muted-foreground">No upcoming appointments</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>{date ? format(date, "MMMM d, yyyy") : "Select a date"}</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant={viewMode === "day" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("day")}
                >
                  Day
                </Button>
                <Button
                  variant={viewMode === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("week")}
                >
                  Week
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-5">
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="payments">Payment Days</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              <TabsContent value="appointments" className="p-4">
                {viewMode === "day" ? (
                  <>
                    {getAppointmentsForDate(date).length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <p className="text-muted-foreground">No appointments scheduled for this day</p>
                        <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" /> Add Appointment
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {getAppointmentsForDate(date)
                          .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
                          .map((appointment) => (
                            <Card key={appointment.id} className="overflow-hidden">
                              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                                <div>
                                  <CardTitle className="text-base">{appointment.title}</CardTitle>
                                  <CardDescription>{appointment.project}</CardDescription>
                                </div>
                                <Badge className={`${statusMap[appointment.status].color} text-white`}>
                                  {statusMap[appointment.status].label}
                                </Badge>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <div className="grid gap-2 text-sm">
                                  <div className="flex items-start gap-2">
                                    <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p>
                                        {formatTime(appointment.date)} -{" "}
                                        {appointment.endTime ? formatTime(appointment.endTime) : "TBD"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p>{appointment.client}</p>
                                    </div>
                                  </div>
                                  {appointment.location && (
                                    <div className="flex items-start gap-2">
                                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                      <div>
                                        <p>{appointment.location}</p>
                                      </div>
                                    </div>
                                  )}
                                  {appointment.description && (
                                    <p className="mt-2 text-muted-foreground">{appointment.description}</p>
                                  )}
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                                {appointment.status === "scheduled" ? (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleStatusChange(appointment.id, "completed")}
                                    >
                                      <Check className="mr-2 h-4 w-4" /> Mark Complete
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleStatusChange(appointment.id, "cancelled")}
                                    >
                                      <X className="mr-2 h-4 w-4" /> Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <div className="w-full text-center text-sm text-muted-foreground">
                                    {appointment.status === "completed"
                                      ? "This appointment has been completed"
                                      : "This appointment has been cancelled"}
                                  </div>
                                )}
                              </CardFooter>
                            </Card>
                          ))}
                      </div>
                    )}
                  </>
                ) : (
                  // Week view for appointments
                  <div className="space-y-6">
                    {Array.from({ length: 7 }, (_, i) => addDays(startOfDay(date || new Date()), i)).map((day) => {
                      const dayAppointments = appointments.filter((appointment) => {
                        const appointmentDate = parseISO(appointment.date)
                        return isSameDay(appointmentDate, day)
                      })

                      return (
                        <div key={day.toISOString()} className="space-y-2">
                          <h3 className="font-medium">{format(day, "EEEE, MMMM d")}</h3>
                          {dayAppointments.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No appointments</p>
                          ) : (
                            <div className="space-y-2">
                              {dayAppointments
                                .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
                                .map((appointment) => (
                                  <div
                                    key={appointment.id}
                                    className="flex items-center justify-between rounded-md border p-3"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`h-2 w-2 rounded-full ${statusMap[appointment.status].color}`} />
                                      <div>
                                        <p className="font-medium">{appointment.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {formatTime(appointment.date)} - {appointment.client}
                                        </p>
                                      </div>
                                    </div>
                                    <Badge className={`${statusMap[appointment.status].color} text-white`}>
                                      {statusMap[appointment.status].label}
                                    </Badge>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="milestones" className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Milestones</CardTitle>
                    <CardDescription>Track important project milestones and deadlines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          id: "MS-001",
                          title: "Kitchen Cabinets Installation",
                          project: "Kitchen Renovation - Sarah Johnson",
                          date: "2023-11-25",
                          status: "upcoming",
                          description: "Install all kitchen cabinets according to the approved design plan",
                        },
                        {
                          id: "MS-002",
                          title: "Bathroom Tile Work Completion",
                          project: "Bathroom Remodel - Michael Chen",
                          date: "2023-11-20",
                          status: "upcoming",
                          description: "Complete all tile work in master bathroom including shower and floor",
                        },
                        {
                          id: "MS-003",
                          title: "Final Inspection",
                          project: "Office Renovation - Westside Corp",
                          date: "2023-12-05",
                          status: "upcoming",
                          description: "Final inspection with city inspector for permit approval",
                        },
                        {
                          id: "MS-004",
                          title: "Project Handover",
                          project: "Retail Store Renovation - Fashion Forward",
                          date: "2023-11-30",
                          status: "upcoming",
                          description: "Complete project handover with client walkthrough and documentation",
                        },
                      ].map((milestone) => (
                        <div key={milestone.id} className="flex items-start space-x-4 rounded-lg border p-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{milestone.title}</h4>
                              <Badge variant={milestone.status === "completed" ? "success" : "outline"}>
                                {milestone.status === "completed" ? "Completed" : "Upcoming"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{milestone.project}</p>
                            <p className="text-sm">{milestone.description}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-1 h-4 w-4" />
                              {new Date(milestone.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <Button variant="outline" size="sm">
                              {milestone.status === "completed" ? "View Details" : "Mark Complete"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments" className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Schedule</CardTitle>
                    <CardDescription>Track upcoming and completed payments for your projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          id: "PMT-001",
                          amount: 8500,
                          project: "Kitchen Renovation - Sarah Johnson",
                          date: "2023-11-25",
                          status: "pending",
                          description: "Payment upon completion of cabinet installation",
                        },
                        {
                          id: "PMT-002",
                          amount: 5000,
                          project: "Bathroom Remodel - Michael Chen",
                          date: "2023-11-20",
                          status: "pending",
                          description: "Payment upon completion of tile work",
                        },
                        {
                          id: "PMT-003",
                          amount: 15000,
                          project: "Office Renovation - Westside Corp",
                          date: "2023-12-01",
                          status: "pending",
                          description: "Final payment upon project completion",
                        },
                        {
                          id: "PMT-004",
                          amount: 20000,
                          project: "Retail Store Renovation - Fashion Forward",
                          date: "2023-11-10",
                          status: "completed",
                          description: "Final payment upon project completion",
                        },
                      ].map((payment) => (
                        <div key={payment.id} className="flex items-start space-x-4 rounded-lg border p-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">${payment.amount.toLocaleString()}</h4>
                              <Badge variant={payment.status === "completed" ? "success" : "outline"}>
                                {payment.status === "completed" ? "Received" : "Pending"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{payment.project}</p>
                            <p className="text-sm">{payment.description}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-1 h-4 w-4" />
                              {new Date(payment.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <Button variant="outline" size="sm">
                              {payment.status === "completed" ? "View Receipt" : "Mark Received"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="timeline" className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Timeline</CardTitle>
                    <CardDescription>
                      Visual timeline of all your project milestones and important dates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {/* Current Month Projects */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">March 2025</h3>
                        <div className="relative">
                          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border"></div>
                          <div className="space-y-6">
                            {milestones
                              .filter((milestone) => parseISO(milestone.date).getMonth() === 2) // March is month 2 (0-indexed)
                              .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
                              .map((milestone, index) => (
                                <div key={milestone.id} className="relative pl-8">
                                  <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border bg-background flex items-center justify-center">
                                    <div className="h-3 w-3 rounded-full bg-primary"></div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{format(parseISO(milestone.date), "MMM d")}</span>
                                      <Badge
                                        variant={
                                          milestone.status === "completed"
                                            ? "success"
                                            : parseISO(milestone.date) < new Date()
                                              ? "destructive"
                                              : "outline"
                                        }
                                      >
                                        {milestone.status === "completed"
                                          ? "Complete"
                                          : parseISO(milestone.date) < new Date()
                                            ? "Overdue"
                                            : "Upcoming"}
                                      </Badge>
                                    </div>
                                    <p className="font-semibold">{milestone.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {milestone.projectName} - {milestone.client}
                                    </p>
                                    <p className="text-sm">{milestone.description}</p>
                                  </div>
                                </div>
                              ))}

                            {/* Add payment events to the timeline */}
                            {payments
                              .filter((payment) => parseISO(payment.date).getMonth() === 2) // March is month 2 (0-indexed)
                              .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
                              .map((payment) => (
                                <div key={payment.id} className="relative pl-8">
                                  <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border bg-background flex items-center justify-center">
                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{format(parseISO(payment.date), "MMM d")}</span>
                                      <Badge variant={payment.status === "paid" ? "success" : "outline"}>
                                        {payment.status === "paid" ? "Paid" : "Due"}
                                      </Badge>
                                    </div>
                                    <p className="font-semibold">
                                      {payment.title} - ${payment.amount.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {payment.projectName} - {payment.client}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>

                      {/* Next Month Projects */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">April 2025</h3>
                        <div className="relative">
                          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border"></div>
                          <div className="space-y-6">
                            {/* Milestone events for April */}
                            {milestones
                              .filter((milestone) => parseISO(milestone.date).getMonth() === 3) // April is month 3 (0-indexed)
                              .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
                              .map((milestone, index) => (
                                <div key={milestone.id} className="relative pl-8">
                                  <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border bg-background flex items-center justify-center">
                                    <div className="h-3 w-3 rounded-full bg-primary"></div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{format(parseISO(milestone.date), "MMM d")}</span>
                                      <Badge variant="outline">Upcoming</Badge>
                                    </div>
                                    <p className="font-semibold">{milestone.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {milestone.projectName} - {milestone.client}
                                    </p>
                                    <p className="text-sm">{milestone.description}</p>
                                  </div>
                                </div>
                              ))}

                            {/* Payment events for April */}
                            {payments
                              .filter((payment) => parseISO(payment.date).getMonth() === 3) // April is month 3 (0-indexed)
                              .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
                              .map((payment) => (
                                <div key={payment.id} className="relative pl-8">
                                  <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border bg-background flex items-center justify-center">
                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{format(parseISO(payment.date), "MMM d")}</span>
                                      <Badge variant="outline">Due</Badge>
                                    </div>
                                    <p className="font-semibold">
                                      {payment.title} - ${payment.amount.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {payment.projectName} - {payment.client}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

