import { cx } from "@/lib/utils";

/** Bloco de espaço reservado enquanto o conteúdo carrega. Decorativo: anuncie o estado noutro elemento. */
export default function Skeleton({ className }) {
  return <div aria-hidden="true" className={cx("animate-pulse rounded-control bg-line motion-reduce:animate-none", className)} />;
}
