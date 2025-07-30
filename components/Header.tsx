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
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserProfile user={session.user} />
      </div>
    </header>
  );
};

export default Header;
