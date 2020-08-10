

import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, trigger, state, style, transition, animate } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Form } from "shared/models/Form";
import { DialogService } from "ui/dialog/dialog.service";
import { FormTitleComponent } from "app/myforms/components/formtitle/formtitle.component";
import { DialogResult } from "ui/dialog/DialogResult";
import { FormEventArgs } from "app/myforms/Models/FormEventArgs";
import { ActionType } from "app/myforms/Models/ActionType";
import { FormsService } from "shared/services/forms/forms.service";
import { DeleteFormRequest } from "shared/models/FormRequest";
import { ResponseBase } from "shared/models/ResponseBase";
import { RouteTransition } from "ui/animations/RouteAnimation";
import { RouteableComponent } from "ui/animations/RouteableComponent";


@Component({
  templateUrl: './myforms.component.html',
  styleUrls: ['./myforms.component.scss'],
  encapsulation:ViewEncapsulation.None,
  animations:[
    RouteableComponent.getAnimation()
  ]
})
export class MyFormsComponent extends RouteableComponent implements OnInit {
  
  forms:Form[];
  

  constructor(private _route:ActivatedRoute,
              private _router:Router,
              private _dialogService:DialogService,
              private _formService:FormsService,
              private _changeDetectorRef: ChangeDetectorRef) {
                super();
                
               }

  ngOnInit() {
    super.ngOnInit();
    this._route.data.subscribe(
        data => { this._handleForms(data);}
          
    );
    this.forms = this._route.snapshot.data['myforms'];
    
  }

  hasForms():Boolean{
    if(this.forms.length === 0){
      return false;
    }
    
    return this.forms.filter((form:Form) => form.markForDeletion === false).length > 0;
  }
  private _handleForms(data){
    this.forms = data['myforms'];
  }

  
  getText():string{
   
    return "Create Form";
  }

  /**
   * Event handler for create form
   * @param e
   */
  onCreateForm(e:any){
    
    this._dialogService.open(FormTitleComponent).subscribe(
        (response:DialogResult) => this._navigate(response)
    );
  }

  getStyles():String{
    return "createform-btn";
  }

  /**
   * Navigates to Form Designer
   * @param response DialogResult
   */
  private _navigate(response:DialogResult):void{
    if(!response || !response.ActionResult){
      return;
    }

    
    this._router.navigate([`/design/edit/0/${response.Data.Title}`]);
  }

  handleAction(eventArgs:FormEventArgs):void{
    switch(eventArgs.actionType){
      case ActionType.Edit:
        
        this._router.navigate([`/design/edit/${eventArgs.form.id}/${eventArgs.form.name}`]);
        break;
      case ActionType.Delete:
        this._handleDeleteAction(eventArgs);
        break;
    }
    
  }

  _handleDeleteAction(eventArgs:FormEventArgs):void{
    
        let formRequest:DeleteFormRequest = new DeleteFormRequest();
        formRequest.FormId = eventArgs.form.id;
        formRequest.IsSoftDelete = true;
        this._formService.deleteForm(formRequest).subscribe(
          (response:ResponseBase) => this._handlePostDeleteAction(response,eventArgs)
        );
  }

  _handlePostDeleteAction(response:ResponseBase,eventArgs:FormEventArgs):void{
    if(!response.isSuccess){
      alert('Oops. Something went wrong');
      return;
    }

   
    let formId:string = eventArgs.form.id;
    
    this.forms.find((form:Form) => form.id === formId).markForDeletion = true;

    
    let modifiedForms:Form[] = [... this.forms];
    this.forms = modifiedForms;

  }

}
