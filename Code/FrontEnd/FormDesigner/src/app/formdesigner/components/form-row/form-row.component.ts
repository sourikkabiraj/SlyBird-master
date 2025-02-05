import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, ViewRef } from '@angular/core';
import { RowAddedEventArgs } from "shared/models/RowAddedEventArgs";
import { FieldControlAddEventArgs } from "shared/models/FieldControlAddEventArgs";
import { SystemConstants } from "shared/models/SystemConstants";
import { RowAction } from "shared/models/RowAction";
import { Row } from "shared/models/Row";
import { RowType } from "shared/models/RowType";
import { FormDesignerStateService } from "app/formdesigner/service/form-designer-state.service";
import { FormFieldControlComponent } from "app/formdesigner/components/form-field-control/form-field-control.component";
import { ConfirmationDialogRequest } from "ui/dialog/confirmation-dialog/ConfirmationDialogRequest";
import { DialogService } from "ui/dialog/dialog.service";
import { ConfirmationDialogComponent } from "ui/dialog/confirmation-dialog/confirmation-dialog.component";
import { DialogResult } from "ui/dialog/DialogResult";



@Component({
    selector:'fd-form-row',
    templateUrl:'./form-row.component.html',
    styleUrls:['./form-row.component.scss']
})
export class FormRowComponent{
    public RowAddArgs:RowAddedEventArgs;
    @ViewChild('fieldContainer',{read:ViewContainerRef}) _rowContainer:ViewContainerRef;

    constructor(private _componentFactoryResolver:ComponentFactoryResolver,
                private _formsDesignerStateService:FormDesignerStateService,
                private _dialogService:DialogService) {
        this._formsDesignerStateService._formFieldRemoveObservable.subscribe((args:FieldControlAddEventArgs) => this._onFieldRemove(args));

        this._formsDesignerStateService._formAddFieldObservable.subscribe(
                (args:FieldControlAddEventArgs) => this._onFieldAdd(args)
        );
    }

    onDrop(e:any):boolean{
        if (e.stopPropagation) {
            e.stopPropagation(); 
        }
       let field =  JSON.parse(e.dataTransfer.getData(SystemConstants.JSON_MIMETYPE));
       let fieldArgs = this._getFieldArgs(field);

       
        this._formsDesignerStateService.addField(fieldArgs);

       
       this._renderControlComponent(fieldArgs); 
        
        return true;
    }

    onDragOver(e:any):boolean{
        return this._handleDragOver(e);
    }

    onDragEnter(e:any):boolean{
        return this._handleDragOver(e);
    }

    _onFieldRemove(args:FieldControlAddEventArgs):void{
        
        if(this.RowAddArgs.Id !== args.rowId){
            return;
        }

        
        let length = this._rowContainer.length;
        let viewIndex:number = -1;
        for(let index = 0;index<length;index++){
            
            let view:any = this._rowContainer.get(index);
            let element = view.rootNodes[0].firstElementChild;
            if(!element){
                continue;
            }
            let dataIdAttr = element.attributes[2];
            if(!dataIdAttr){
                continue;
            }
            let id:string = dataIdAttr.value;
            if(id === args.field.id){
                viewIndex = index;
                break;
            }
        }
        if(viewIndex !== -1){
            
            this._rowContainer.remove(viewIndex);
        }
    }

    _onFieldAdd(fieldArgs:FieldControlAddEventArgs):void{
        if(fieldArgs.ignoreOp){
            return;
        }
        if(this.RowAddArgs.Id !== fieldArgs.rowId){
            return;
        }
        
       this._renderControlComponent(fieldArgs); 
    }

    private _renderControlComponent(fieldArgs:FieldControlAddEventArgs){
        let resolver = this._componentFactoryResolver.resolveComponentFactory(FormFieldControlComponent);
        
        let component = this._rowContainer.createComponent(resolver);
        component.instance.fieldArgs = fieldArgs;
    }

    private _getFieldArgs(field:any):FieldControlAddEventArgs{
        let fieldArgs = new FieldControlAddEventArgs();
        fieldArgs.field = field;
        fieldArgs.rowId = this.RowAddArgs.Id;
        fieldArgs.rowAction = RowAction.Added;

        return fieldArgs;
    }

    private _handleDragOver(e:any):boolean{
           if(this._allowDrop(e)){
            if (e.preventDefault) {
                e.preventDefault();
            }
        }
        return true;
    }

    private _allowDrop(e:any):boolean{
        
        let row:Row = this._formsDesignerStateService.lookupRow(this.RowAddArgs.Id);
        if(row == null || row.fields.length === 0){
           return true;
        }

        if(row.fields.length === 1){
            if(+row.fields[0].layoutType === RowType.Span){
                return false;
            }
        }

        if(row.fields.length === SystemConstants.MAX_FIELDS_COUNT){
            return false;
        }

        return true;
    }

    showInstructions():Boolean{
        let row:Row = this._formsDesignerStateService.lookupRow(this.RowAddArgs.Id);
        if(row == null || row.fields.length === 0){
           return true;
        }
        return false;
    }

    
    deleteRow():void{
         let request:ConfirmationDialogRequest = new ConfirmationDialogRequest();
        request.Title = "Delete Row";
        request.Description = "Are you sure you want to delete the row?";
        this._dialogService.openConfirmationDialog(ConfirmationDialogComponent,request).subscribe(
            (response:DialogResult) => {this._handleRowDeleteConfirmation(response);}
        );
    }

    _handleRowDeleteConfirmation(response:DialogResult):void{
     
      if(!response.ActionResult){
        return;
      }

      

      this._formsDesignerStateService.removeRow(this.RowAddArgs);
   }
}