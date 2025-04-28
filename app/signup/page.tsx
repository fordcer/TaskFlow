import FormCard from "@/components/auth/form-card";
import { ModeToggle } from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="absolute top-4 right-4 md:right-8 md:top-8">
        <ModeToggle />
      </div>
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost">← Back</Button>
      </Link>
      <FormCard mode="signup" />
    </div>
  );
}
