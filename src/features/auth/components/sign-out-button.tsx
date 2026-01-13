"use client";

import { Button } from "@/ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Button onClick={handleSignOut} variant="outline" className="w-full">
      Sign out
    </Button>
  );
}
