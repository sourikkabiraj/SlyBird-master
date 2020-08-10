import { AbstractControl } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { UserExistsRequest } from "shared/models/auth/UserExistsRequest";
import { ValidatorFn } from "@angular/forms/src/directives/validators";
import { AuthService } from "shared/services/auth/auth.service";
import { UserExistsResponse } from "shared/models/auth/UserExistsResponse";


export function userExistsValidator(request:UserExistsRequest,authService:AuthService):ValidatorFn{
    return (control:AbstractControl ):
    Observable<{[key:string]:boolean} | null> =>{
      
       request.Value = control.value;

       return authService.isUserExists(request).map((response:UserExistsResponse) => {
            return response.Exists ?  {'exists':true} : null;
       });
           
    }
}


