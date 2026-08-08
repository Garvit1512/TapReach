"use client";

import { createContext, useContext } from "react";

const TenantContext = createContext<string | null>(null);

export function TenantProvider({ tenantId, children }: { tenantId: string; children: React.ReactNode }) {
  return <TenantContext.Provider value={tenantId}>{children}</TenantContext.Provider>;
}

export function useTenantId() {
  const tenantId = useContext(TenantContext);
  if (!tenantId) {
    throw new Error("useTenantId must be used within a TenantProvider");
  }
  return tenantId;
}
