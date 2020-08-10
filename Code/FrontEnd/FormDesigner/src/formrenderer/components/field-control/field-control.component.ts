import { Component, AfterContentInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { FieldBase } from "shared/models/FieldBase";
import { FieldType } from "shared/models/FieldType";
import { FieldComponentFactory } from "formrenderer/components/FieldComponentFactory";

@Component({
  selector: 'fd-field-control',
  templateUrl: './field-control.component.html',
  styleUrls: ['./field-control.component.scss']
})
export class FieldControlComponent implements AfterContentInit {
  @Input() field:FieldBase;
    @Input() formGroup:FormGroup;
    fieldType = FieldType;
    
    @ViewChild('fieldControl',{read:ViewContainerRef}) _fieldControl:ViewContainerRef;
    

  constructor(private _componentFactoryResolver:ComponentFactoryResolver){
        
    }

   ngAfterContentInit(): void {
         let fieldControlComponent = FieldComponentFactory.getFieldControl(this.field);
         let resolver = this._componentFactoryResolver.resolveComponentFactory(fieldControlComponent);
          let component = this._fieldControl.createComponent(resolver);
          let instance:any = component.instance;
          instance.field = this.field;
        instance.formGroup = this.formGroup; 
    }

}
