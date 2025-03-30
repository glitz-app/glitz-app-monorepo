import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="container flex flex-col items-center justify-center px-4 py-16">
        <Image
          src={"/images/glitz_logo.svg"}
          alt={"Glitz logo"}
          width={80}
          height={80}
          className="mb-8"
        />
        <h1 className="mb-24 text-4xl font-bold sm:text-[5rem]">Glitz</h1>

        <div className="col-span-1 flex justify-end">
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard/projects" />
          </SignedOut>
          <SignedIn>
            <Button variant="ghost">
              <Link href="/dashboard/projects">Go to dashboard</Link>
            </Button>
          </SignedIn>
        </div>
      </div>
    </main>
  );
}
