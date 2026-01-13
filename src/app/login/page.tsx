import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import LoginForm from "@/features/auth/components/login-form";
import { Navigation } from "@/features/layout/components/navigation";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { getSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getSession();

  return (
    <main className="flex flex-col items-center min-h-screen bg-background">
      <Navigation />
      <div className="flex-grow flex items-center justify-center w-full">
        <Card className="w-full max-w-sm border-0 shadow-none bg-transparent">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {session ? "User Profile" : "Login"}
            </CardTitle>
            <CardDescription className="text-center">
              {session
                ? "Manage your account"
                : "Welcome, please sign in below"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {session ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={session.user?.image || ""}
                      alt={session.user?.name || ""}
                    />
                    <AvatarFallback>
                      {session.user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {session.user?.name || "No name set"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <LoginForm />
            )}
          </CardContent>
          {session && (
            <CardFooter>
              <SignOutButton />
            </CardFooter>
          )}
        </Card>
      </div>
    </main>
  );
}
