

import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Form } from "shared/models/Form";
import { Observable } from "rxjs/Observable";
import { FormsService } from "shared/services/forms/forms.service";
import { FormRequest } from "shared/models/FormRequest";

@Injectable()
export class FormDesignerRouteResolver implements Resolve<Form>{

    constructor(private _formService:FormsService){
        
    }

    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Form | Observable<Form> | Promise<Form> {
           let formId:string = route.params.id;
           let formName:string = route.params.name;
               if(formId === '0'){
                let form:Form = new Form();
                form.id = formId;
                form.name = formName;
                return form;
            }
              let formRequest:FormRequest = new FormRequest();
            formRequest.FetchData = false;
            formRequest.FormId = formId;
            return this._formService.getFormMeta(formRequest);
        }


}