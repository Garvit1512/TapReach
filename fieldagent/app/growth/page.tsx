import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { AgentRunner } from "@/components/AgentRunner";
import { COMMANDS } from "@/lib/prompts/commands";

export default async function GrowthPage() {
  if (!(await isAuthed())) redirect("/login");

  return (
    <AgentRunner
      def={COMMANDS.growth}
      hint="Needs the Growth Fit column filled in by past recons and debriefs. Roughly useless until you've done 15–20 debriefs — it'll tell you so."
      primaryLabel="Pipeline tab"
      primaryPlaceholder="Business	Vertical	Stage	Contact	Role	Phone	Value	…	Growth Fit"
      primaryKind="paste"
    />
  );
}
