import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { Form } from "shared/models/Form";
import { FieldBase } from "shared/models/FieldBase";
import { FormsService } from "shared/services/forms/forms.service";
import { FormDesignerStateService } from "app/formdesigner/service/form-designer-state.service";
import { FormRequest } from "shared/models/FormRequest";
import { ResponseBase } from "shared/models/ResponseBase";
import { Row } from "shared/models/Row";
import { RowAddedEventArgs } from "shared/models/RowAddedEventArgs";
import { FieldControlAddEventArgs } from "shared/models/FieldControlAddEventArgs";
import { RowAction } from "shared/models/RowAction";
import { NotificationBarService } from "ui/notification-bar/notification-bar.service";
import { TextNotificationMessage } from "ui/notification-bar/NotificationMessage";
import { RouteableComponent } from "ui/animations/RouteableComponent";



@Component({
  selector: 'fd-form-designer-chrome',
  templateUrl: './form-designer-chrome.component.html',
  styleUrls: ['./form-designer-chrome.component.scss'],
  encapsulation:ViewEncapsulation.Emulated,
  animations:[
    RouteableComponent.getAnimation()
  ]
})
export class FormDesignerChromeComponent extends RouteableComponent implements OnInit {
  _controls:FieldBase[] = [];
  _showLoadIndicator:Boolean = false;

  constructor(private _route:ActivatedRoute,private _router:Router,
              private _formsService:FormsService,private _formsDesignerStateService:FormDesignerStateService,
              private _notificationService: NotificationBarService) {
                super();
      
   }

  ngOnInit() {
    let form = this._route.snapshot.data['design'];
    this._formsDesignerStateService._form = form;
    this._renderFormMeta(form);

    
    this._controls = this._formsService.getControls();
  }

  
  navigateToMyForms(e:any):void{
    this._router.navigate(['/myforms']);
  }

  _getForm():Form{
    return this._formsDesignerStateService._form;
  }


  onFormSave(e:any):void{
     let formMeta:any = this._formsDesignerStateService.getFormMeta(true);
   let formRequest:FormRequest = new FormRequest();
   formRequest.Form = formMeta;
   formRequest.FormId = this._getForm().id;
   this._showLoadIndicator = true;
   this._formsService.saveFormMeta(formRequest).subscribe(
            (response:ResponseBase) => {this._handleFormSaveResponse(response);}  
        );
}


 onFormPreview(e:any):void{
    this._formsDesignerStateService.saveFormState(this._getForm().name);
  this._router.navigate([`/preview/0`]);
 }

  _handleFormSaveResponse(response:ResponseBase){
        this._showLoadIndicator = false;
        this._formsDesignerStateService._form = response.data;
          let message:TextNotificationMessage = new TextNotificationMessage();
        message.Message = "Form saved successfully";
        message.Action = "Dismiss";
        message.Duration = 3000;
        this._notificationService.showTextNotificationUI(message);
    }


    private _renderFormMeta(form:Form):void{
        if(form.id === "0"){
          return;
        }
        let rows:Row[] = form.tabs[0].rows;
        for(let row of rows){
            let rowAddEventArgs:RowAddedEventArgs = new RowAddedEventArgs();
            let rowId = row.id;
            rowAddEventArgs.Id = rowId;

              this._formsDesignerStateService.addRow(rowAddEventArgs,true);

    let fields:FieldBase[] = row.fields;
            for(let field of fields){
                let fieldControlAddEventArgs:FieldControlAddEventArgs = new FieldControlAddEventArgs();
                fieldControlAddEventArgs.rowId = rowId;
                fieldControlAddEventArgs.rowAction = RowAction.Added;
                fieldControlAddEventArgs.field = field;
                fieldControlAddEventArgs.ignoreOp = false;

                this._formsDesignerStateService.addField(fieldControlAddEventArgs,true);
            }
            
        }
    }

    onRowAdded(e:any):void{

    }

}
