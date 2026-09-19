import { Search, Bell, User } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-foreground focus-visible:ring-0 placeholder:text-muted-foreground"
            placeholder="Search players, clubs or transfers..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button variant="ghost" size="icon">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </Button>
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />
          <Button variant="ghost" size="icon" className="rounded-full bg-muted">
            <span className="sr-only">User profile</span>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
