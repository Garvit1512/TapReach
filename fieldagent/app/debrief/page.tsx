import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { AgentRunner } from "@/components/AgentRunner";
import { COMMANDS } from "@/lib/prompts/commands";

export default async function DebriefPage() {
  if (!(await isAuthed())) redirect("/login");

  return (
    <AgentRunner
      def={COMMANDS.debrief}
      hint="Dump everything — messy is fine, don't tidy it up. Who you met, what they said, numbers, what you promised, what you forgot to ask."
      primaryLabel="What happened"
      primaryPlaceholder={
        "went to sharma salon lajpat nagar, owner not there, met receptionist priya\n" +
        "9899xxxxxx she said owner comes after 5\n" +
        "showed her the card she liked it\n" +
        "6 chairs\n" +
        "didn't quote anything"
      }
      primaryKind="paste"
      allowVoice
    />
  );
}
