
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Form } from "shared/models/Form";
import { DOMHelper } from "shared/utils/DOMHelper";
import { FormEventArgs } from "app/myforms/Models/FormEventArgs";
import { ActionType } from "app/myforms/Models/ActionType";
import { DialogService } from "ui/dialog/dialog.service";
import { ConfirmationDialogComponent } from "ui/dialog/confirmation-dialog/confirmation-dialog.component";
import { DialogResult } from "ui/dialog/DialogResult";
import { ConfirmationDialogRequest } from "ui/dialog/confirmation-dialog/ConfirmationDialogRequest";


@Component({
  selector: 'fd-formitem',
  templateUrl: './formlist.component.html',
  styleUrls: ['./formlist.component.scss']
})
export class FormListComponent implements OnInit {
  
  @Input() form:Form;

  @Output() notifyAction: EventEmitter<FormEventArgs> = new EventEmitter<FormEventArgs>();

  private FORMID_ATTR:string = "data-form-id";
  private DATAACTION_ATTR:string = "data-action";

  
  constructor(private _dialogService:DialogService) { }

  ngOnInit() {
  }

  /**
   * Event handler when an item is clicked.
   * Delegates the event to appropriate handler based on the data action attribute. This way of event handling
   * reduces the number of event handlers to just one per list item
   * @param e Event
   */
  onItemClick(e:any){
      
      let action:string = DOMHelper.getAttribute(e.target,this.DATAACTION_ATTR);

      switch(action){
        case "edit":
          this.onFormEdit();
          break;
        case "delete":
          this.onFormDelete();
          break;
        
      }
  }

  /**
   * Event handler for delete form action
   * @param e Event object
   */
  onFormDelete():void{
    
    let request:ConfirmationDialogRequest = new ConfirmationDialogRequest();
    request.Title = "Delete Form";
    request.Description = "Are you sure you want to delete the form?";
    this._dialogService.openConfirmationDialog(ConfirmationDialogComponent,request).subscribe(
        (response:DialogResult) => {this._handleFormDeleteConfirmation(response);}
    );
  }

 
   onFormEdit():void{
      
      let formEventArgs:FormEventArgs = new FormEventArgs();
      formEventArgs.form = this.form;
      formEventArgs.actionType = ActionType.Edit;


     
      this.notifyAction.emit(formEventArgs);
   }

   _handleFormDeleteConfirmation(response:DialogResult):void{
     
      if(!response.ActionResult){
        return;
      }

      
      let formEventArgs:FormEventArgs = new FormEventArgs();
      formEventArgs.form = this.form;
      formEventArgs.actionType = ActionType.Delete;


      
      this.notifyAction.emit(formEventArgs);
   }
}
