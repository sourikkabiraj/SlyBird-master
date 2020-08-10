
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';  


import { UiModule } from "ui/ui.module";


import { LoginComponent } from "app/auth/components/login/login.component";
import { RegisterComponent } from "app/auth/components/register/register.component";


const routes: Routes = [
  {  path: 'login',component:LoginComponent  },
  {  path: 'signup', component:RegisterComponent}
];

@NgModule({
    imports:[
        RouterModule.forChild(routes),
        UiModule,
        ReactiveFormsModule,
        CommonModule
    ],
    declarations: [
        LoginComponent,
        RegisterComponent
    ]
})
export class AuthModule{

}