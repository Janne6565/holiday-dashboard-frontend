import { KonsolePage } from "@/pages/konsole";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: KonsolePage,
});
