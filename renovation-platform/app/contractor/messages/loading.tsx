import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function MessagesLoading() {
  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col">
      <div className="mb-4">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid flex-1 gap-4 md:grid-cols-[300px_1fr]">
        {/* Conversations List */}
        <div className="flex flex-col border rounded-lg overflow-hidden">
          <div className="border-b p-3">
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="border-b px-3 py-2">
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="flex-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 border-b p-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-4">
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  <Skeleton className={`h-20 w-[70%] rounded-lg`} />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t p-3">
            <div className="flex w-full gap-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 flex-1 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

