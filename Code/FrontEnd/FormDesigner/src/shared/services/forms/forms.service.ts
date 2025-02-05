

import { Injectable } from '@angular/core';
import { Http,Response,RequestOptionsArgs } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';

import { Form } from "shared/models/Form";
import { ServiceBase } from "shared/services/ServiceBase";
import { FieldBase } from "shared/models/FieldBase";
import { FieldType } from "shared/models/FieldType";
import { FormRequest, DeleteFormRequest } from "shared/models/FormRequest";
import { ResponseBase } from "shared/models/ResponseBase";
import { HttpHelper } from "shared/utils/HttpHelper";
import { Tab } from "shared/models/Tab";
import { Row } from "shared/models/Row";
import { DropdownField } from "shared/models/DropdownField";
import { RadiobuttonField } from "shared/models/RadiobuttonField";
import { KeyValuePair } from "shared/Models/KeyValuePair";
import { LongTextField } from "shared/models/LongTextField";
import { IValidator } from "shared/models/IValidator";
import { ShortTextField } from "shared/models/ShortTextField";
import { AuthStateService } from "shared/services/auth/auth-state-service";


@Injectable()
export class FormsService extends ServiceBase {
    private _formSaveUrl:string = '/form/meta';
    private _getFormsUrl:string = `/forms/0`;
    private _getFormMetaUrl:string = `/form/meta/`;
    private _deleteFormUrl:string = `/form/meta/`;

    private _formState:Form;


   
  constructor(http:Http,authStateService: AuthStateService ) {
    super(http,authStateService);
   }

  
  public getForms():Observable<Form[]>{
    let url = this._baseUrl + this._getFormsUrl;    
    
    return this.get(url)
               .map((response:Response) => {return <Form[]>this._getFormsResponse(response)})
               .catch((response:Response) => {return this.handleError(response)});
  }

  
  public getFormMeta(formRequest:FormRequest):Observable<Form>{
    let url = this._baseUrl + this._getFormMetaUrl + formRequest.FormId;
    return this.get(url)
               .map((response:Response) => {return <Form>this._handleFormMetaResponse(response)})
               .catch(this.handleError);
  }

  

  
  public getControls():FieldBase[]{
        let _controls:FieldBase[] = [];

         
        _controls.push(this._getControl("shortText","Short Text",FieldType.ShortText));
        
        _controls.push(this._getControl("longText","Long Text",FieldType.LongText));
        
        _controls.push(this._getControl("dropDown","Drop Down",FieldType.Dropdown));
        
        _controls.push(this._getControl("radio","Radio Buttons",FieldType.Radio));
        
        _controls.push(this._getControl("date","Date",FieldType.Date));
        
        _controls.push(this._getControl("checkbox","Checkbox",FieldType.Checkbox));

        return _controls;
    }

    
    public saveFormMeta(formRequest:FormRequest):Observable<ResponseBase>{
        let url = this._baseUrl + this._formSaveUrl;
        if(formRequest.FormId !== "0"){
            url = url + "/" + formRequest.FormId;
        }

        return this.post(url,formRequest.Form)
                          .map((response:Response) => {return <ResponseBase>this.mapPostResponse(response)});
    }

    public deleteForm(deleteFormRequest:DeleteFormRequest):Observable<ResponseBase>{
        let url = this._baseUrl + this._deleteFormUrl + deleteFormRequest.FormId + '/' + deleteFormRequest.IsSoftDelete;
        return this.delete(url,{})
                          .map((response:Response) => {return <ResponseBase>this.mapPostResponse(response)});
    }

    public saveFormState(form:Form){
        this._formState = form;
    }

    public getFormState(formId:String): Form{
        if(formId === "0"){
            return this._formState;
        }
        
    }

    private _getFormsResponse(response:Response):Form[]{
        let json = response.json().data;
        let forms:Form[] = [];

        for(let form of json){
            let formObj = new Form();
            formObj.id = form.id;
            formObj.name = form.name;
            formObj.markForDeletion = form.markForDeletion ? form.markForDeletion: false;

            forms.push(formObj);
        }
        return forms;
  }

    
    private _handleFormMetaResponse(response:Response):Form{
        let json = response.json().data[0];
        let form = new Form();
        form.id = json.id;
        form.name =  json.name,
          form.tabs =  this._getTabs(json);


           return form;

    }

    private _getTabs(json:any):Tab[]{
        let tabs:Tab[] = [];

        for(let tab of json.tabs){
            let tabControl = new Tab();
            tabControl.id = tab.id,
            tabControl.name =  tab.name,
            tabControl.ordinal = tab.ordinal,
            tabControl.rows = this._getRows(tab.rows)
            tabs.push(tabControl);
        }

        return tabs;
    }

    private _getRows(rowsJson:any):Row[]{
        let rows:Row[] = [];
        for(let row of rowsJson){
            let rowObj = new Row();
            rowObj.rowType = row.rowType;
            rowObj.id = row.id;
            rowObj.fields = this._getFields(row);

            rows.push(rowObj);
        }
        return rows;
    }

    private _getFields(tab:any):FieldBase[]{
        let fields:FieldBase[] = [];
        for(let field of tab.fields){
           
            let fieldControl = this._createField(field);
            fields.push(fieldControl);
        }

        return fields;
    }

     private _createField(field:any):FieldBase{
        let fieldControl:any;
        switch(field.type){
            case FieldType.ShortText:
                fieldControl = this._createShortTextField(field);
                break;
            case FieldType.Dropdown:
                fieldControl = new DropdownField();
                fieldControl.values = this._getDropdownValues(field);
                break;
            case FieldType.Radio:
                fieldControl = new RadiobuttonField();
                fieldControl.values = this._getDropdownValues(field);
                break;
            case FieldType.LongText:
                fieldControl = this._createLongTextField(field);
                break;
            default:
                fieldControl = new FieldBase();
                break;
            
        }

        this._setCommonProperties(fieldControl,field);
        return fieldControl;
    }

    private _setCommonProperties(fieldControl:FieldBase,field:any){
        fieldControl.id = field.id;
        fieldControl.label = field.label;
        fieldControl.name = field.name;
        fieldControl.required = field.required;
        fieldControl.type = field.type;
        fieldControl.value = field.value;
        fieldControl.layoutType = field.layoutType;
        fieldControl.readOnly = field.readOnly ? field.readOnly: false;

        fieldControl.validators = this._addValidators(field);

    }

    private _getDropdownValues(field:any):KeyValuePair[]{
        let pairs:KeyValuePair[] = [];
        let values = field.values;
        let length = values.length;
        for(let i=0;i<length;i++){
           let pair = new KeyValuePair();
           pair.key = values[i].key;
           pair.value = values[i].value;

           pairs.push(pair);
        }
        return pairs;
    }

    
    private _createShortTextField(field:any):ShortTextField{
        let shortTextField:ShortTextField = new ShortTextField();
        shortTextField.minLength = +field.minLength;
        shortTextField.maxLength = +field.maxLength;

        return shortTextField;
    }

    private _createLongTextField(field:any):LongTextField{
        let longTextField = new LongTextField();
        longTextField.rows = +field.rows;
        longTextField.columns = +field.columns;

        return longTextField;
    }

    private _addValidators(field:any):IValidator[]{
        let validators:IValidator[] = [];
        let values = field.validators;
        if(values == null){
            return validators;
        }
        let length = values.length;
        for(let i=0;i<length;i++){
            let validator:IValidator={
                key : values[i].name,
                validatorData:values[i].value
            };

            validators.push(validator);
        }

        return validators;
    }


     private _getControl(name:string,label:string,type:FieldType):FieldBase{
        let fieldControl = new FieldBase();
        fieldControl.name = name;
        fieldControl.label = label;
        fieldControl.type = type;

        return fieldControl;
    }

  private handleError(error:Response):any{
        console.log(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    

}
