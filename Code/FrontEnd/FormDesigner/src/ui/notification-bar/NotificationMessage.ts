
export abstract class NotificationMessageBase{
    public Duration:number;
}


export class TextNotificationMessage extends NotificationMessageBase{
     public Message:string;
    public Action:string;
}


export class ComponentNotificationMessage extends NotificationMessageBase{
    public Component:any;
}