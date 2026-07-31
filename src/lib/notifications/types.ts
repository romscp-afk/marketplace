export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
  template?: string;
  metadata?: Record<string, string>;
}

export interface NotificationRecord {
  id: string;
  userId?: string;
  email?: string;
  type: string;
  title: string;
  message: string;
  href?: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationProvider {
  sendEmail(message: EmailMessage): Promise<{ success: boolean; messageId?: string }>;
  createInAppNotification(
    notification: Omit<NotificationRecord, "id" | "createdAt" | "read">,
  ): Promise<NotificationRecord>;
}
