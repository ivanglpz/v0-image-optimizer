import { ImageOptimizer } from "@/components/image-optimizer";

export default function Home() {
  return (
    <main className="bg-background flex flex-col h-dvh w-dvw overflow-hidden">
      <div className=" flex flex-col gap-4 p-4  h-full">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Image Optimizer
            </h1>
            <p className="text-muted-foreground text-sm">
              {"Optimize your images for better quality and compression"}
            </p>
          </div>
        </header>
        <ImageOptimizer />
      </div>
    </main>
  );
}
