"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/AuthProvider";

export function useRedirectIfAuthenticated(targetPath: string = "/proyectos") {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push(targetPath);
    }
  }, [user, isLoading, targetPath, router]);
}
