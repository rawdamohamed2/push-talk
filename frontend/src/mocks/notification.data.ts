export type NotificationType =
  "message" | "channel_invite" | "member_joined" | "mention" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
}

export const mockNotifications: Notification[] = [
  // {
  //   id: "notification-1",
  //   type: "message",
  //   title: "New message",
  //   message: "Sarah sent you a new message.",
  //   link: "/chats/sarah",
  // },
  // {
  //   id: "notification-2",
  //   type: "mention",
  //   title: "You were mentioned",
  //   message: "Ahmed mentioned you in #general.",
  //   link: "/channels/general",
  // },
  // {
  //   id: "notification-3",
  //   type: "channel_invite",
  //   title: "Channel invitation",
  //   message: "Mona invited you to join #design.",
  //   link: "/channels/design",
  // },
  // {
  //   id: "notification-4",
  //   type: "member_joined",
  //   title: "New member",
  //   message: "Omar joined your #team channel.",
  //   link: "/channels/team",
  // },
  {
    id: "notification-5",
    type: "system",
    title: "Welcome to PushTalk",
    message: "Your account is ready. Start connecting with your team!",
    link: "/channels/team",
  },
];
