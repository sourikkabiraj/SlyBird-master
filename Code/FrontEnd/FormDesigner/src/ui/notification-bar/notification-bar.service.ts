
import { Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material";
import { NotificationMessageBase, TextNotificationMessage, ComponentNotificationMessage } from "ui/notification-bar/NotificationMessage";

@Injectable()
export class NotificationBarService {

  
  constructor(private _snackBar: MatSnackBar) {
      
  }

  
  public showTextNotificationUI(notificationMessage:TextNotificationMessage):void{
      this._snackBar.open(notificationMessage.Message,notificationMessage.Action,{
      duration: notificationMessage.Duration,
      });
  }

  
  public showComponentNotificationUI(notificationMessage:ComponentNotificationMessage):void{
      this._snackBar.openFromComponent(notificationMessage.Component,{
        duration: notificationMessage.Duration,
      });
  }

}
