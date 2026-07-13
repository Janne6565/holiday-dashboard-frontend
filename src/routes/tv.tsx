import { TvDashboardPage } from "@/pages/tv-dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tv")({
  component: TvDashboardPage,
});
