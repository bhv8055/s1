import { Logo } from "@/components/icons/logo";
import Link from "next/link";

export default function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b bg-card">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary font-semibold">
          <Logo className="h-8 w-8" />
          <span className="text-xl font-headline font-bold">SwastyaScan</span>
        </Link>
      </div>
    </header>
  );
}
