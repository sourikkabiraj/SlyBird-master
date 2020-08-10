import {Injectable} from '@angular/core';
import { Subject, Observable } from 'rxjs/Rx';
import { Form } from "shared/models/Form";
import { RowAddedEventArgs } from "shared/models/RowAddedEventArgs";
import { FieldControlAddEventArgs } from "shared/models/FieldControlAddEventArgs";
import { IdService } from "shared/services/id-manager/id-manager.service";
import { Row } from "shared/models/Row";
import { RowType } from "shared/models/RowType";
import { FieldBase } from "shared/models/FieldBase";
import { Tab } from "shared/models/Tab";
import { FormsService } from "shared/services/forms/forms.service";



@Injectable()
export class FormDesignerStateService{
    public _form:Form = null;
    private _formName:string;

    private _formAddRowSource = new Subject<RowAddedEventArgs>();
    private _formAddFieldSource = new Subject<FieldControlAddEventArgs>();
    private _formFieldPropertyChangeSource = new Subject<FieldControlAddEventArgs>();
    private _formFieldRemoveSource = new Subject<FieldControlAddEventArgs>();
    private _formRowRemoveSource = new Subject<RowAddedEventArgs>();

    public _formAddRowObservable:Observable<RowAddedEventArgs> = null;
    public _formAddFieldObservable:Observable<FieldControlAddEventArgs> = null;
    public _formFieldPropertyChangeObservable:Observable<FieldControlAddEventArgs> = null;
    public _formFieldRemoveObservable:Observable<FieldControlAddEventArgs> = null;
    public _formRowRemoveObservable:Observable<RowAddedEventArgs> = null;

    private _fieldNameIndex:number = 1;

    constructor(private _idService:IdService,private _formService:FormsService){
        this._formAddRowObservable = this._formAddRowSource.asObservable();
        this._formAddFieldObservable = this._formAddFieldSource.asObservable();
        this._formFieldPropertyChangeObservable = this._formFieldPropertyChangeSource.asObservable();
        this._formFieldRemoveObservable = this._formFieldRemoveSource.asObservable();
        this._formRowRemoveObservable = this._formRowRemoveSource.asObservable();
    } 

    public getFieldName(fieldName:string):string{
        return fieldName + this._fieldNameIndex++;
    }

    public addRow(rowArgs:RowAddedEventArgs,skipAdd:boolean = false):void{
        
        this._formAddRowSource.next(rowArgs);

        if(!skipAdd){
            
            let row:Row = new Row();
            
            row.fields = [];
            row.rowType = RowType.Left;
            row.id = rowArgs.Id;
            if(!this._form.tabs){
                this._initialize();
            }
            this._form.tabs[0].rows.push(row);
        }
    } 

    public addField(fieldArgs:FieldControlAddEventArgs,skipAdd:boolean = false):void{
        if(!skipAdd){
            
            let row = this.lookupRow(fieldArgs.rowId);
            if(row === null){
                return;
            }
            let fieldControl:FieldBase = fieldArgs.field;
            
            if(fieldArgs.field == null){
                return;
            }

            
            fieldControl.id = this._idService.nextId();
            
            let name = fieldControl.name;
            fieldControl.name = this.getFieldName(name);
            
            fieldControl.layoutType = row.fields.length === 0 ? RowType.Left : RowType.Right;

            row.fields.push(fieldArgs.field);
        }
        
        this._formAddFieldSource.next(fieldArgs);
    }

    
    public fieldSelected(fieldArgs:FieldControlAddEventArgs):void{
        
        this._formAddFieldSource.next(fieldArgs);
    }

    public onFieldPropertyChange(fieldArgs:FieldControlAddEventArgs):void{
        let row = this.lookupRow(fieldArgs.rowId);
        if(row == null){
            return;
        }
        let fields:any = row.fields;
        let field = fields.find((field:FieldBase) => {
            if(field == null){
                return false;
            }
            return field.id === fieldArgs.field.id;
        });
        if(field == null){
                return;
        }else{
            let index = this.getIndexOf(fields,field.id);
            row.fields[index] = fieldArgs.field;
        }
         this._updateRowType(row,fieldArgs);
        this._formFieldPropertyChangeSource.next(fieldArgs);
    }

    public onFieldSelect(fieldArgs:FieldControlAddEventArgs):void{
        
    }

    public onFieldRemove(fieldArgs:FieldControlAddEventArgs):void{
        let fieldId:string = fieldArgs.field.id;
        let fields:FieldBase[] = this.lookupRow(fieldArgs.rowId).fields;
        let fieldsLength = fields.length;
        let fieldIndex:number = this.getIndexOf(fields,fieldId);

         if(fieldIndex === -1){
             return;
         }

           fields.splice(fieldIndex,1);

           this._formFieldRemoveSource.next(fieldArgs);
    }

    
    public removeRow(rowArgs:RowAddedEventArgs):void{
 let row:Row = this.lookupRow(rowArgs.Id);
        if(row == null){
            return;
        }
           this._formRowRemoveSource.next(rowArgs);
          let rows:Row[] = this._form.tabs[0].rows;
        let index:number = rows.findIndex((row:Row) => row.id === rowArgs.Id);
        if(index === -1){
            return;
        }
        rows.splice(index,1);
    }

    public getFormMeta(toJson:boolean):any{
          return toJson ? JSON.stringify(this._form): this._form;
    }

    public saveFormState(formName:string):void{
        this._form.name = formName;
        this._formService.saveFormState(this._form);
    }

    private _initialize(){
          this._form.tabs = [];

        let tab = new Tab();
        tab.id = this._idService.nextId();
        tab.name = "Tab";
        tab.ordinal = 0;
        tab.rows = [];
        this._form.tabs.push(tab);
    }

    public lookupRow(rowId:string):Row{
           return this._form.tabs[0].rows.find((row) => row.id === rowId);   
    }

    public hasFormMeta():Boolean{
        if(!this._form){
            return false;
        }
        return this._form.tabs && this._form.tabs[0].rows.length > 0;
    }

    private getIndexOf(array:any,item:any):number{
        let index = -1,
            length = array.length;
        for(let i = 0;i<length;i++){
            if(array[i].id === item){
                return i;
            }
        }
        return index;
    }

        private _updateRowType(row:Row,fieldArgs:FieldControlAddEventArgs):void{
        if(row.fields.length == 2){
            row.rowType = RowType.Both;
            return;
        }
        row.rowType = +fieldArgs.field.layoutType;
    }

}