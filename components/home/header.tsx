import Link from "next/link";
import { ModeToggle } from "../toggle-theme";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-14 px-4 md:px-0 mx-auto flex items-center justify-between">
        <Link href="/">
          <span className="text-2xl font-bold">TaskFlow</span>
        </Link>
        <nav>
          <ul className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </ul>
        </nav>
      </div>
    </header>
  );
}
