import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { AgentRunner } from "@/components/AgentRunner";
import { COMMANDS } from "@/lib/prompts/commands";

export default async function ReconPage() {
  if (!(await isAuthed())) redirect("/login");

  return (
    <AgentRunner
      def={COMMANDS.recon}
      hint="Do this on the way there, not outside the door — it searches the web and takes a minute or two."
      primaryLabel="Business name"
      primaryPlaceholder="Sharma Salon, Fitness First, Biryani Blues…"
      primaryKind="line"
      areaLabel="Area"
    />
  );
}
