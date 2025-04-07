"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  UserPlus,
  MessageSquare,
  DollarSign,
  CheckCircle,
  XCircle,
  Search,
  Calendar,
  FileText,
  Trash,
  Edit,
  Plus,
  Download,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"

// Mock data for project subcontractors
const mockSubcontractors = [
  {
    id: "sub-001",
    name: "Mike Johnson",
    company: "Johnson Electrical Services",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MJ",
    specialty: "Electrician",
    status: "active",
    startDate: "2025-02-15",
    endDate: "2025-03-15",
    rate: 75,
    rateType: "hourly",
    totalHours: 48,
    totalPaid: 1800,
    totalDue: 1800,
    nextPayment: "2025-03-01",
    tasks: [
      {
        id: "task-001",
        name: "Electrical rough-in",
        status: "completed",
        hours: 24,
        documents: ["electrical_specs.pdf", "wiring_diagram.pdf"],
      },
      { id: "task-002", name: "Fixture installation", status: "in-progress", hours: 16, documents: [] },
      { id: "task-003", name: "Final electrical inspection", status: "not-started", hours: 8, documents: [] },
    ],
  },
  {
    id: "sub-002",
    name: "Sarah Williams",
    company: "Williams Plumbing Co.",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SW",
    specialty: "Plumber",
    status: "active",
    startDate: "2025-02-20",
    endDate: "2025-03-10",
    rate: 80,
    rateType: "hourly",
    totalHours: 32,
    totalPaid: 1280,
    totalDue: 1280,
    nextPayment: "2025-03-05",
    tasks: [
      { id: "task-004", name: "Plumbing rough-in", status: "completed", hours: 20, documents: [] },
      { id: "task-005", name: "Fixture installation", status: "not-started", hours: 12, documents: [] },
    ],
  },
  {
    id: "sub-003",
    name: "Carlos Rodriguez",
    company: "Rodriguez Carpentry",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "CR",
    specialty: "Carpenter",
    status: "pending",
    startDate: null,
    endDate: null,
    rate: 65,
    rateType: "hourly",
    totalHours: 0,
    totalPaid: 0,
    totalDue: 0,
    nextPayment: null,
    tasks: [],
  },
]

// Mock data for available subcontractors to add
const availableSubcontractors = [
  {
    id: "sub-004",
    name: "Lisa Chen",
    company: "Chen Painting & Drywall",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "LC",
    specialty: "Painter",
    rating: 4.6,
  },
  {
    id: "sub-005",
    name: "David Kim",
    company: "Kim HVAC Solutions",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "DK",
    specialty: "HVAC Technician",
    rating: 4.9,
  },
]

export default function ProjectSubcontractors() {
  const { toast } = useToast()
  const [subcontractors, setSubcontractors] = useState(mockSubcontractors)
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentNote, setPaymentNote] = useState("")
  const [newTask, setNewTask] = useState({ name: "", hours: "", documents: [] })
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter subcontractors based on search and status
  const filteredSubcontractors = subcontractors.filter((sub) => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const nameMatch = sub.name.toLowerCase().includes(query)
      const companyMatch = sub.company.toLowerCase().includes(query)
      const specialtyMatch = sub.specialty.toLowerCase().includes(query)

      if (!(nameMatch || companyMatch || specialtyMatch)) {
        return false
      }
    }

    // Apply status filter
    if (statusFilter !== "all" && sub.status !== statusFilter) {
      return false
    }

    return true
  })

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
      description: `Your message has been sent to ${selectedSubcontractor.name}.`,
    })
  }

  // Handle making a payment
  const handleMakePayment = () => {
    if (!paymentAmount.trim()) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive",
      })
      return
    }

    // Update subcontractor payment info
    setSubcontractors(
      subcontractors.map((sub) => {
        if (sub.id === selectedSubcontractor.id) {
          return {
            ...sub,
            totalPaid: sub.totalPaid + amount,
            totalDue: Math.max(0, sub.totalDue - amount),
          }
        }
        return sub
      }),
    )

    // Reset form
    setPaymentAmount("")
    setPaymentNote("")
    setIsPaymentDialogOpen(false)

    // Show success message
    toast({
      title: "Payment Sent",
      description: `Payment of $${amount.toFixed(2)} has been sent to ${selectedSubcontractor.name}.`,
    })
  }

  // Handle adding a new task
  const handleAddTask = () => {
    if (!newTask.name.trim() || !newTask.hours.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both task name and estimated hours.",
        variant: "destructive",
      })
      return
    }

    const hours = Number.parseInt(newTask.hours)
    if (isNaN(hours) || hours <= 0) {
      toast({
        title: "Invalid Hours",
        description: "Please enter a valid number of hours.",
        variant: "destructive",
      })
      return
    }

    // Add new task to subcontractor
    setSubcontractors(
      subcontractors.map((sub) => {
        if (sub.id === selectedSubcontractor.id) {
          const newTaskObj = {
            id: `task-${Date.now()}`,
            name: newTask.name,
            status: "not-started",
            hours,
            documents: newTask.documents || [],
          }

          return {
            ...sub,
            tasks: [...sub.tasks, newTaskObj],
            totalHours: sub.totalHours + hours,
            totalDue: sub.totalDue + hours * sub.rate,
          }
        }
        return sub
      }),
    )

    // Reset form
    setNewTask({ name: "", hours: "", documents: [] })
    setIsTaskDialogOpen(false)

    // Show success message
    toast({
      title: "Task Added",
      description: `New task "${newTask.name}" has been added for ${selectedSubcontractor.name}.`,
    })
  }

  // Handle accepting a pending subcontractor
  const handleAcceptSubcontractor = (id: string) => {
    setSubcontractors(
      subcontractors.map((sub) => {
        if (sub.id === id) {
          const today = new Date()
          const endDate = new Date()
          endDate.setMonth(endDate.getMonth() + 1) // Set end date to 1 month from now

          return {
            ...sub,
            status: "active",
            startDate: today.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
          }
        }
        return sub
      }),
    )

    toast({
      title: "Subcontractor Accepted",
      description: "The subcontractor has been added to your project team.",
    })
  }

  // Handle rejecting a pending subcontractor
  const handleRejectSubcontractor = (id: string) => {
    setSubcontractors(subcontractors.filter((sub) => sub.id !== id))

    toast({
      title: "Subcontractor Rejected",
      description: "The subcontractor invitation has been declined.",
    })
  }

  // Handle adding a new subcontractor
  const handleAddSubcontractor = (subcontractor: any) => {
    const newSubcontractor = {
      ...subcontractor,
      status: "pending",
      startDate: null,
      endDate: null,
      rate: subcontractor.hourlyRate || 70,
      rateType: "hourly",
      totalHours: 0,
      totalPaid: 0,
      totalDue: 0,
      nextPayment: null,
      tasks: [],
    }

    setSubcontractors([...subcontractors, newSubcontractor])
    setIsAddDialogOpen(false)

    toast({
      title: "Invitation Sent",
      description: `An invitation has been sent to ${subcontractor.name}.`,
    })
  }

  // Handle removing a subcontractor
  const handleRemoveSubcontractor = (id: string) => {
    setSubcontractors(subcontractors.filter((sub) => sub.id !== id))

    toast({
      title: "Subcontractor Removed",
      description: "The subcontractor has been removed from your project team.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Project Subcontractors</h2>
          <p className="text-muted-foreground">Manage your project team and subcontractor tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Subcontractor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Subcontractor to Project</DialogTitle>
                <DialogDescription>Invite a subcontractor to join your project team.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="mb-4">
                  <Input placeholder="Search subcontractors..." className="mb-4" />
                </div>
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {availableSubcontractors.map((sub) => (
                    <Card key={sub.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={sub.avatar} />
                              <AvatarFallback>{sub.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{sub.name}</h3>
                              <p className="text-sm text-muted-foreground">{sub.company}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{sub.specialty}</Badge>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" onClick={() => handleAddSubcontractor(sub)}>
                            Invite
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subcontractors..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all" className="w-auto">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
              All
            </TabsTrigger>
            <TabsTrigger value="active" onClick={() => setStatusFilter("active")}>
              Active
            </TabsTrigger>
            <TabsTrigger value="pending" onClick={() => setStatusFilter("pending")}>
              Pending
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4">
        {filteredSubcontractors.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <UserPlus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No subcontractors found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {statusFilter === "all"
                ? "Add subcontractors to your project team"
                : statusFilter === "active"
                  ? "No active subcontractors found"
                  : "No pending subcontractor invitations"}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
              }}
            >
              Reset Filters
            </Button>
          </Card>
        ) : (
          filteredSubcontractors.map((subcontractor) => (
            <Card key={subcontractor.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={subcontractor.avatar} />
                      <AvatarFallback>{subcontractor.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{subcontractor.name}</CardTitle>
                      <CardDescription>{subcontractor.company}</CardDescription>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline">{subcontractor.specialty}</Badge>
                        <Badge
                          variant={subcontractor.status === "active" ? "default" : "secondary"}
                          className={
                            subcontractor.status === "pending"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
                              : ""
                          }
                        >
                          {subcontractor.status === "active" ? "Active" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {subcontractor.status === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleAcceptSubcontractor(subcontractor.id)}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleRejectSubcontractor(subcontractor.id)}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Decline
                        </Button>
                      </>
                    ) : (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedSubcontractor(subcontractor)}>
                              <MessageSquare className="mr-1 h-4 w-4" />
                              Message
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Send Message</DialogTitle>
                              <DialogDescription>
                                Send a message to {selectedSubcontractor?.name} about this project.
                              </DialogDescription>
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
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleRemoveSubcontractor(subcontractor.id)}
                        >
                          <Trash className="mr-1 h-4 w-4" />
                          Remove
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              {subcontractor.status === "active" && (
                <>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Start Date:</span>
                          <span className="text-sm">{subcontractor.startDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">End Date:</span>
                          <span className="text-sm">{subcontractor.endDate || "Ongoing"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Rate:</span>
                          <span className="text-sm">
                            ${subcontractor.rate}/{subcontractor.rateType}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Total Hours:</span>
                          <span className="text-sm">{subcontractor.totalHours} hrs</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Total Paid:</span>
                          <span className="text-sm text-green-600">${subcontractor.totalPaid.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Total Due:</span>
                          <span className="text-sm text-amber-600">${subcontractor.totalDue.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Next Payment:</span>
                          <span className="text-sm">{subcontractor.nextPayment || "Not scheduled"}</span>
                        </div>
                        <div className="flex justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                onClick={() => setSelectedSubcontractor(subcontractor)}
                                disabled={subcontractor.totalDue <= 0}
                              >
                                <DollarSign className="mr-1 h-4 w-4" />
                                Make Payment
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Make Payment</DialogTitle>
                                <DialogDescription>Send a payment to {selectedSubcontractor?.name}.</DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <label className="text-sm font-medium">Amount ($)</label>
                                  <Input
                                    type="number"
                                    placeholder="Enter payment amount"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    Total due: ${selectedSubcontractor?.totalDue.toFixed(2)}
                                  </p>
                                </div>
                                <div className="grid gap-2">
                                  <label className="text-sm font-medium">Note (Optional)</label>
                                  <Input
                                    placeholder="Add a payment note..."
                                    value={paymentNote}
                                    onChange={(e) => setPaymentNote(e.target.value)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleMakePayment}>Send Payment</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Tasks</h3>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedSubcontractor(subcontractor)}>
                              <Plus className="mr-1 h-4 w-4" />
                              Add Task
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Add New Task</DialogTitle>
                              <DialogDescription>Add a new task for {selectedSubcontractor?.name}.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="task-name">Task Name</Label>
                                <Input
                                  id="task-name"
                                  placeholder="Enter task name"
                                  value={newTask.name}
                                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="task-hours">Estimated Hours</Label>
                                <Input
                                  id="task-hours"
                                  type="number"
                                  placeholder="Enter estimated hours"
                                  value={newTask.hours}
                                  onChange={(e) => setNewTask({ ...newTask, hours: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="task-documents">Documents</Label>
                                <div className="border border-input rounded-md p-2">
                                  <Input
                                    id="task-documents"
                                    type="file"
                                    multiple
                                    className="cursor-pointer"
                                    onChange={(e) => {
                                      // In a real app, you would handle file uploads to storage
                                      // For now, we'll just store the file names
                                      const fileNames = Array.from(e.target.files || []).map((file) => file.name)
                                      setNewTask({ ...newTask, documents: fileNames })
                                    }}
                                  />
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Upload specifications, drawings, or other relevant documents
                                  </p>
                                  {newTask.documents.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-sm font-medium">Selected files:</p>
                                      <ul className="text-sm mt-1 space-y-1">
                                        {newTask.documents.map((doc, index) => (
                                          <li key={index} className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            {doc}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleAddTask}>Add Task</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {subcontractor.tasks.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">No tasks assigned yet</div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Task</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Hours</TableHead>
                              <TableHead>Documents</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {subcontractor.tasks.map((task) => (
                              <TableRow key={task.id}>
                                <TableCell className="font-medium">{task.name}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={
                                      task.status === "completed"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                        : task.status === "in-progress"
                                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                                    }
                                  >
                                    {task.status === "in-progress"
                                      ? "In Progress"
                                      : task.status === "not-started"
                                        ? "Not Started"
                                        : "Completed"}
                                  </Badge>
                                </TableCell>
                                <TableCell>{task.hours} hrs</TableCell>
                                <TableCell>
                                  {task.documents && task.documents.length > 0 ? (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <FileText className="h-4 w-4 mr-1" />
                                          {task.documents.length}
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Task Documents</DialogTitle>
                                          <DialogDescription>Documents attached to task: {task.name}</DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4">
                                          <ul className="space-y-2">
                                            {task.documents.map((doc, index) => (
                                              <li key={index} className="flex items-center gap-2 p-2 border rounded-md">
                                                <FileText className="h-5 w-5 text-blue-500" />
                                                <span>{doc}</span>
                                                <Button variant="ghost" size="sm" className="ml-auto">
                                                  <Download className="h-4 w-4" />
                                                </Button>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">None</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/50 px-6 py-3">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Calendar className="mr-1 h-4 w-4" />
                          Schedule
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-1 h-4 w-4" />
                          Documents
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardFooter>
                </>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

