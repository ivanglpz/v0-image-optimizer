import { ImageOptimizer } from "@/components/image-optimizer"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="min-h-screen  bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-7xl h-full">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Image Optimizer</h1>
            <p className="text-muted-foreground">{"Optimize your images for better quality and compression"}</p>
          </div>
          <ThemeToggle />
        </header>
        <ImageOptimizer />
      </div>
    </main>
  )
}
