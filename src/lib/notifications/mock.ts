import { generateId } from "@/lib/utils";
import type {
  EmailMessage,
  NotificationProvider,
  NotificationRecord,
} from "@/lib/notifications/types";

export class MockNotificationProvider implements NotificationProvider {
  private notifications: NotificationRecord[] = [];
  private sentEmails: EmailMessage[] = [];

  async sendEmail(message: EmailMessage): Promise<{ success: boolean; messageId?: string }> {
    this.sentEmails.push(message);
    if (process.env.NODE_ENV === "development") {
      console.debug("[Email]", message.to, message.subject);
    }
    return { success: true, messageId: `msg_${generateId().slice(0, 8)}` };
  }

  async createInAppNotification(
    notification: Omit<NotificationRecord, "id" | "createdAt" | "read">,
  ): Promise<NotificationRecord> {
    const record: NotificationRecord = {
      ...notification,
      id: generateId(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(record);
    return record;
  }

  getSentEmails(): EmailMessage[] {
    return [...this.sentEmails];
  }

  getNotifications(): NotificationRecord[] {
    return [...this.notifications];
  }
}
