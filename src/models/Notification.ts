export type ISOString = string;
export type UserID = string;

export type Notification = {
    id: string;
    title: string;
    message: string;
    date: ISOString;
    priority: "low" | "medium" | "high";
    isRead: boolean;
    recipientId: UserID
}