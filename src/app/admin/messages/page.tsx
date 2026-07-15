import { prisma } from "@/lib/prisma";
import { MessagesManager } from "@/components/admin/MessagesManager";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = process.env.DATABASE_URL
    ? await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } })
    : [];

  return <MessagesManager initialMessages={messages} />;
}
