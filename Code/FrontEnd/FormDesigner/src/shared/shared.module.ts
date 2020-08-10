

import {NgModule} from '@angular/core';
import { Http, RequestOptions, ConnectionBackend } from '@angular/http';

import { IdService } from './services/id-manager/id-manager.service';
import { FormsService } from "shared/services/forms/forms.service";
import { AuthService } from "shared/services/auth/auth.service";
import { AuthStateService } from "shared/services/auth/auth-state-service";

@NgModule({
    providers:[
          { provide:IdService, useClass:IdService},
        FormsService,
        AuthService,
        AuthStateService
    
    ]
})
export class SharedModule{

}