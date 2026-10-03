import { StatusPill } from "@/components/ui";
import { STATUS_LABELS } from "../constants";

export default function PostStatusPill({ status }) {
  return <StatusPill tone={status === "published" ? "safe" : "neutral"}>{STATUS_LABELS[status] ?? status}</StatusPill>;
}
