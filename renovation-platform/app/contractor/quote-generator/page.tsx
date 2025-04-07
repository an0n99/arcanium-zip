"use client"

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  clientName: z.string().min(2, {
    message: "Client name must be at least 2 characters.",
  }),
  clientEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  projectType: z.string({
    required_error: "Please select a project type.",
  }),
  projectAddress: z.string().min(5, {
    message: "Project address must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  startDate: z.date({
    required_error: "Please select a start date.",
  }),
  estimatedDuration: z.string({
    required_error: "Please select an estimated duration.",
  }),
  taxRate: z.number().min(0).max(100),
  includeDisclaimer: z.boolean().default(true),
})

type LineItem = {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export default function QuoteGeneratorPage() {
  const [currentTab, setCurrentTab] = useState("details")
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "Labor", quantity: 1, unitPrice: 0, total: 0 },
    { id: "2", description: "Materials", quantity: 1, unitPrice: 0, total: 0 },
  ])
  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      description: "",
      taxRate: 8.5,
      includeDisclaimer: true,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Here you would typically send the data to your backend
    // For now, we'll just move to the next tab
    if (currentTab === "details") {
      setCurrentTab("lineItems")
    } else if (currentTab === "lineItems") {
      setCurrentTab("preview")
    } else if (currentTab === "preview") {
      // Final submission would happen here
      console.log("Final submission with line items:", lineItems)
      alert("Quote generated successfully!")
      // Redirect to dashboard or quotes page
      // window.location.href = "/contractor/dashboard";
    }
  }

  const addLineItem = () => {
    const newId = (lineItems.length + 1).toString()
    setLineItems([...lineItems, { id: newId, description: "", quantity: 1, unitPrice: 0, total: 0 }])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length <= 1) return
    setLineItems(lineItems.filter((item) => item.id !== id))
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    const updatedItems = lineItems.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }

        // Recalculate total if quantity or unitPrice changes
        if (field === "quantity" || field === "unitPrice") {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
        }

        return updatedItem
      }
      return item
    })

    setLineItems(updatedItems)

    // Recalculate subtotal, tax, and total
    const newSubtotal = updatedItems.reduce((sum, item) => sum + item.total, 0)
    const newTax = newSubtotal * (form.getValues().taxRate / 100)
    const newTotal = newSubtotal + newTax

    setSubtotal(newSubtotal)
    setTax(newTax)
    setTotal(newTotal)
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Quote Generator</h1>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="lineItems">Line Items</TabsTrigger>
          <TabsTrigger value="preview">Preview Quote</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Enter the basic information about the project and client.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Email</FormLabel>
                          <FormControl>
                            <Input placeholder="client@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a project type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="kitchen">Kitchen Renovation</SelectItem>
                            <SelectItem value="bathroom">Bathroom Remodel</SelectItem>
                            <SelectItem value="basement">Basement Finishing</SelectItem>
                            <SelectItem value="addition">Home Addition</SelectItem>
                            <SelectItem value="outdoor">Outdoor/Patio</SelectItem>
                            <SelectItem value="repair">Repair Work</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St, City, State, ZIP" {...field} />
                        </FormControl>
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
                          <Textarea placeholder="Describe the scope of work..." className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Estimated Start Date</FormLabel>
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
                      name="estimatedDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Duration</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                              <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                              <SelectItem value="1-2 months">1-2 months</SelectItem>
                              <SelectItem value="2-3 months">2-3 months</SelectItem>
                              <SelectItem value="3-6 months">3-6 months</SelectItem>
                              <SelectItem value="6+ months">6+ months</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="taxRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Rate (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Enter the applicable tax rate for this project.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="includeDisclaimer"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Include standard disclaimer</FormLabel>
                          <FormDescription>Add our standard terms and conditions to this quote.</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Continue to Line Items
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lineItems">
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>Add the individual items and services for this quote.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-center">Unit Price</div>
                    <div className="col-span-2 text-center">Total</div>
                    <div className="col-span-1"></div>
                  </div>

                  {lineItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 p-4 border-b last:border-0 items-center">
                      <div className="col-span-5">
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                          className="text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                          className="text-center"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="col-span-2 text-center font-medium">${item.total.toFixed(2)}</div>
                      <div className="col-span-1 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLineItem(item.id)}
                          disabled={lineItems.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" onClick={addLineItem} className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Line Item
                </Button>

                <div className="rounded-md border p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Tax ({form.getValues().taxRate}%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentTab("details")}>
                Back to Details
              </Button>
              <Button onClick={() => form.handleSubmit(onSubmit)()}>Continue to Preview</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Quote Preview</CardTitle>
              <CardDescription>Review your quote before sending it to the client.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-md border p-6">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-2xl font-bold">Quote</h2>
                      <p className="text-muted-foreground">
                        #
                        {Math.floor(Math.random() * 10000)
                          .toString()
                          .padStart(4, "0")}
                      </p>
                      <p className="text-muted-foreground mt-1">Date: {format(new Date(), "MMMM d, yyyy")}</p>
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold">ABC Contractors</h3>
                      <p className="text-sm">123 Contractor St</p>
                      <p className="text-sm">New York, NY 10001</p>
                      <p className="text-sm">info@abccontractors.com</p>
                      <p className="text-sm">(555) 123-4567</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="font-bold mb-2">Bill To:</h3>
                      <p>{form.getValues().clientName}</p>
                      <p>{form.getValues().clientEmail}</p>
                      <p>{form.getValues().projectAddress}</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Project Details:</h3>
                      <p>
                        <span className="font-medium">Type:</span> {form.getValues().projectType}
                      </p>
                      <p>
                        <span className="font-medium">Start Date:</span>{" "}
                        {form.getValues().startDate ? format(form.getValues().startDate, "MMMM d, yyyy") : "TBD"}
                      </p>
                      <p>
                        <span className="font-medium">Duration:</span> {form.getValues().estimatedDuration}
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="font-bold mb-2">Project Description:</h3>
                    <p className="whitespace-pre-line">{form.getValues().description}</p>
                  </div>

                  <div className="mb-8">
                    <h3 className="font-bold mb-4">Line Items:</h3>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-muted">
                        <div className="col-span-6">Description</div>
                        <div className="col-span-2 text-center">Quantity</div>
                        <div className="col-span-2 text-center">Unit Price</div>
                        <div className="col-span-2 text-center">Total</div>
                      </div>

                      {lineItems.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 p-4 border-b last:border-0">
                          <div className="col-span-6">{item.description}</div>
                          <div className="col-span-2 text-center">{item.quantity}</div>
                          <div className="col-span-2 text-center">${item.unitPrice.toFixed(2)}</div>
                          <div className="col-span-2 text-center">${item.total.toFixed(2)}</div>
                        </div>
                      ))}

                      <div className="grid grid-cols-12 gap-2 p-4 border-t">
                        <div className="col-span-8 text-right font-medium">Subtotal:</div>
                        <div className="col-span-4 text-center">${subtotal.toFixed(2)}</div>
                      </div>
                      <div className="grid grid-cols-12 gap-2 p-4 border-t">
                        <div className="col-span-8 text-right font-medium">Tax ({form.getValues().taxRate}%):</div>
                        <div className="col-span-4 text-center">${tax.toFixed(2)}</div>
                      </div>
                      <div className="grid grid-cols-12 gap-2 p-4 border-t bg-muted">
                        <div className="col-span-8 text-right font-bold">Total:</div>
                        <div className="col-span-4 text-center font-bold">${total.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>

                  {form.getValues().includeDisclaimer && (
                    <div className="mb-8">
                      <h3 className="font-bold mb-2">Terms & Conditions:</h3>
                      <div className="text-sm text-muted-foreground">
                        <p className="mb-2">1. This quote is valid for 30 days from the date of issue.</p>
                        <p className="mb-2">
                          2. A 50% deposit is required to begin work, with the remaining balance due upon completion.
                        </p>
                        <p className="mb-2">3. Any changes to the scope of work may result in additional charges.</p>
                        <p className="mb-2">4. ABC Contractors provides a 1-year warranty on all workmanship.</p>
                        <p>5. Client is responsible for obtaining any necessary permits unless otherwise specified.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentTab("lineItems")}>
                Back to Line Items
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">Download PDF</Button>
                <Button onClick={() => form.handleSubmit(onSubmit)()}>Send to Client</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

