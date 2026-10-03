import { StatusPill } from "@/components/ui";
import { OCCURRENCE_STATUS } from "../constants";

export default function OccurrenceStatusPill({ status }) {
  const meta = OCCURRENCE_STATUS[status] ?? { label: status, tone: "neutral" };
  return <StatusPill tone={meta.tone}>{meta.label}</StatusPill>;
}
