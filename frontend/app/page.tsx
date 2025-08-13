"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Manage Your Tasks with Ease
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    TaskMaster helps you organize your work, track your
                    progress, and achieve your goals. Simple, intuitive, and
                    powerful.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="w-full min-[400px]:w-auto btn-purple"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full min-[400px]:w-auto btn-purple-outline"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl border bg-muted/50 shadow-xl">
                  <div className="p-4">
                    <div className="h-2 w-20 rounded-full bg-muted-foreground/20 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 rounded-full bg-muted-foreground/20"></div>
                      <div className="h-4 w-1/2 rounded-full bg-muted-foreground/20"></div>
                      <div className="h-4 w-2/3 rounded-full bg-muted-foreground/20"></div>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-2">
                      <div className="h-20 rounded-lg bg-muted-foreground/20"></div>
                      <div className="h-20 rounded-lg bg-muted-foreground/20"></div>
                      <div className="h-20 rounded-lg bg-muted-foreground/20"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 TaskMaster. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
