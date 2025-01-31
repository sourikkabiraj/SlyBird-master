
import { Injectable } from '@angular/core';
import { User } from "shared/models/auth/User";


@Injectable()
export class AuthStateService{
   private _currentUser:User ; 

   public setCurrentUser(jsonData:any):void{
     this._currentUser = new User();
     this._currentUser.userId = jsonData.user.userId;
     this._currentUser.userName = jsonData.user.userName;
     this._currentUser.isGuest = jsonData.user.isGuest || false;
     this._currentUser.authToken = jsonData.authToken;
   }

   public getCurrentUser():User{
       return this._currentUser;
   }

   public clearAuth():void{
     this._currentUser.authToken = null;
     this._currentUser = null;

   }

   public isAuthenticated():boolean{
     return this._currentUser == null ? false: true;
   }

}
