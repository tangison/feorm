"use client";

import dynamic from "next/dynamic";

// Lazy load TangisonChat — heavy component that's only needed when the user
// clicks the chat button. Avoids shipping the chat UI + message state on
// every page load.
const TangisonChat = dynamic(
  () => import("@/components/feorm/tangison-chat"),
  { ssr: false }
);

export default function LazyTangisonChat() {
  return <TangisonChat />;
}
