"use client";

import { RoomProvider } from "@/contexts/room-context";
import { AuthProvider } from "@/contexts/user-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RoomProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </RoomProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
