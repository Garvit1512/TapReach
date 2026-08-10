import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { AgentRunner } from "@/components/AgentRunner";
import { COMMANDS } from "@/lib/prompts/commands";

export default async function PlanPage() {
  if (!(await isAuthed())) redirect("/login");

  return (
    <AgentRunner
      def={COMMANDS.plan}
      hint="Open the Follow-Ups tab, select all, copy, paste it here. Include the header row."
      primaryLabel="Follow-Ups tab"
      primaryPlaceholder="Business	Contact	Role	Phone	Action	Channel	Due Date	Due Time	Status…"
      primaryKind="paste"
    />
  );
}
