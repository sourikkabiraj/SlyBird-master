import { Component, OnInit } from '@angular/core';
import { AuthService } from "shared/services/auth/auth.service";
import { UserAuthInfo } from "shared/models/auth/UserAuthInfo";
import { ResponseBase } from "shared/models/ResponseBase";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators,FormBuilder } from "@angular/forms";
import { RouteableComponent } from 'ui/animations/RouteableComponent';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations:[
    RouteableComponent.getAnimation()
  ]
})
export class LoginComponent extends RouteableComponent implements OnInit {
  
  public _loginFormGroup:FormGroup;
  
  
  constructor(private authService:AuthService,
              private _router:Router,
              private _formBuilder:FormBuilder) {
    super();
   }

  ngOnInit() {
    
    this._loginFormGroup = this._formBuilder.group({
      userName:['',[Validators.required]],
      password:['',[Validators.required]]
    });
  }

  
  onLogin():void{
    var userAuthInfo = new UserAuthInfo();
    var value = this._loginFormGroup.value;
    userAuthInfo.userName = value.userName;
    userAuthInfo.password = value.password;

    this.authService.doLogin(userAuthInfo).subscribe(
      (value:ResponseBase) => {this._router.navigate(['/myforms'])},
      (error:any) => console.error(error)
    );
  }

  getUsernamePlaceholder():String{
    return "Enter Username here";
  }

  getUserFormControlName():String{
    return "userName";
  }

  getPasswordFormControlName():String{
    return "password";
  }

  getPasswordPlaceholder():String{
    return "Enter Password here";
  }

  getLoginButtonText():String{
    return "Login";
  }

  getPasswordType():String{
    return "password";
  }

  getStyles(type:Boolean):String{
    return "ok-btn";
  }

  

}
