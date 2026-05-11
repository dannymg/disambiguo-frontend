"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Loading from "@/components/common/Dialogs/Loading";
import { useAuth } from "@/hooks/auth";

interface RequireAuthProps {
  children: ReactNode;
  requireAnalista?: boolean;
}

export default function RequireAuth({ children, requireAnalista = true }: RequireAuthProps) {
  const { user, isAnalista, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requireAnalista && !isAnalista) {
      router.replace("/403");
    }
  }, [isAnalista, isLoading, pathname, requireAnalista, router, user]);

  if (isLoading || !user || (requireAnalista && !isAnalista)) {
    return <Loading />;
  }

  return <>{children}</>;
}
