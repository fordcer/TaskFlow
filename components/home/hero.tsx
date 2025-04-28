import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Manage your tasks with ease
              </h1>
              <p className="text-muted-foreground md:text-xl">
                TaskFlow helps you organize your work, collaborate with your
                team, and get more done.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/signup">
                <Button size="lg" className="group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Login
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-full overflow-hidden rounded-xl border bg-white p-4 shadow-xl sm:h-[400px] lg:h-[500px] dark:bg-gray-950 dark:border-gray-800">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50 dark:from-blue-950 dark:to-indigo-950"></div>
              <div className="relative z-10 flex h-full flex-col gap-4 overflow-hidden">
                <div className="h-8 w-full rounded-md bg-blue-100/50 animate-pulse dark:bg-blue-900/50"></div>
                <div className="flex flex-1 gap-4">
                  <div className="w-1/3 rounded-md bg-blue-100/50 animate-pulse delay-100 dark:bg-blue-900/50"></div>
                  <div className="w-2/3 rounded-md bg-blue-100/50 animate-pulse delay-200 dark:bg-blue-900/50"></div>
                </div>
                <div className="h-32 w-full rounded-md bg-blue-100/50 animate-pulse delay-300 dark:bg-blue-900/50"></div>
                <div className="h-8 w-1/2 rounded-md bg-blue-100/50 animate-pulse delay-400 dark:bg-blue-900/50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
