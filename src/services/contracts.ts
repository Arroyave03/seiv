import type { DashboardSnapshot } from "@/types/finance";

export type SyncAdapter = {
  pullSnapshot(): Promise<DashboardSnapshot | null>;
  pushSnapshot(snapshot: DashboardSnapshot): Promise<void>;
};

export type AuthSession = {
  userId: string;
  displayName: string;
  accessToken?: string;
};
