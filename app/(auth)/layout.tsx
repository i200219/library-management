import { ReactNode } from "react";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (session) 
    {redirect("/books")};

  return (
    <main className="auth-container">
      <section className="auth-form">
        <div className="auth-box">
          <div className="flex flex-row gap-2 sm:gap-3 items-center">
            <Image src="/icons/logo.svg" alt="logo" width={32} height={32} className="sm:w-[37px] sm:h-[37px]" />
            <h1 className="text-lg sm:text-2xl font-semibold text-white">USIU Library System</h1>
          </div>

          <div>{children}</div>
        </div>
      </section>

      <section className="auth-illustration">
        <Image
          src="/images/library.jpg"
          alt="auth illustration"
          height={1000}
          width={1000}
          className="size-full object-cover"
        />
      </section>
    </main>
  );
};

export default Layout;
