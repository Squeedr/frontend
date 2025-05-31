"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export default function EmailConfirmedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-3 rounded-full bg-green-100 w-fit">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Email Successfully Confirmed!</CardTitle>
          <CardDescription className="text-base mt-2">
            Your email address has been verified. You can now log in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-2">
          <p className="text-sm text-muted-foreground">
            You may now proceed to the login page.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pt-2">
          <Button size="lg" className="px-8" onClick={() => router.push("/auth")}>
            Proceed to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 