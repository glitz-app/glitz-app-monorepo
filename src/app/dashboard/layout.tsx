import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <nav className="fixed left-0 top-0 z-40 grid h-[60px] w-full grid-cols-3 items-center border-b border-neutral-200 bg-white pl-3 pr-3 md:pr-5">
        <div className="col-span-1">
          <Link href="/dashboard/projects" className="flex items-center gap-3 font-montserrat font-bold">
            <Image
              src="/images/glitz_logo.svg"
              alt="GLITZ"
              width={38}
              height={38}
              className="!shadow-red-500 drop-shadow-[0_2px_4px_rgba(190,188,255,1)]"
            />
            <span className="text-2xl">GLITZ</span>
          </Link>
        </div>
        <div className="col-span-1"></div>
        <div className="col-span-1 flex justify-end">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-[36px] h-[36px]",
                  avatarBox: "w-[36px] h-[36px]",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
      {/* ---- nav spacer ----  */}
      <div className="h-[60px]"></div>
      <div className="flex w-full">
        <section className="h-[calc(100vh-60px)] w-[60px] items-center border-r border-neutral-200 bg-white px-1"></section>
        <main className="h-full w-[calc(100%-60px)]">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
