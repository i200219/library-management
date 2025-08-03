import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { UserProfile } from "./UserProfile";
import { User } from "next-auth";

interface HeaderProps {
  session: {
    user: User;
  };
}

const Header = ({ session }: HeaderProps) => {
  return (
    <header className="my-6 sm:my-10 flex justify-between items-center gap-3 sm:gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={32} height={32} className="sm:w-10 sm:h-10" />
      </Link>

      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />
        <UserProfile user={session.user} />
      </div>
    </header>
  );
};

export default Header;
