import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { RowAddedEventArgs } from "shared/models/RowAddedEventArgs";
import { FormRowComponent } from "app/formdesigner/components/form-row/form-row.component";
import { FormDesignerStateService } from "app/formdesigner/service/form-designer-state.service";
import { IDisposable } from "shared/interfaces/IDisposable";


@Component({
    selector:'fd-form-canvas',
    templateUrl:'./form-canvas.component.html',
    styleUrls:['./form-canvas.component.scss']
})
export class FormCanvasComponent implements OnInit, IDisposable {
    @ViewChild('rowContainer',{read:ViewContainerRef}) _rowContainer:ViewContainerRef;

    constructor(private _componentFactoryResolver:ComponentFactoryResolver,
                private _formsDesignerStateService:FormDesignerStateService){
        
        this._formsDesignerStateService._formAddRowObservable.subscribe(
            (args:RowAddedEventArgs) => this.onRowAdded(args)
         );

         this._formsDesignerStateService._formRowRemoveObservable.subscribe(
            (args:RowAddedEventArgs) => this.onRowRemoved(args)
         );
    }

    ngOnInit():void{

    }

    onRowAdded(args:RowAddedEventArgs):void{
         let resolver = this._componentFactoryResolver.resolveComponentFactory(FormRowComponent);
        let component = this._rowContainer.createComponent(resolver);
        let instance:any = component.instance;
         instance.RowAddArgs = args;
    }  

    
    onRowRemoved(args:RowAddedEventArgs):void{
          let length = this._rowContainer.length;
        let viewIndex:number = -1;
        for(let index = 0;index<length;index++){
              let view:any = this._rowContainer.get(index);
            let attr = view.rootNodes[0].firstElementChild.attributes[3];
            if(attr == null)
            {
                return;
            }
            let id:string = attr.value;
            if(id === args.Id){
                viewIndex = index;
                break;
            }
        }
        if(viewIndex !== -1){
             this._rowContainer.remove(viewIndex);
        }
    }

    
    showInstructions():Boolean{
        return !this._formsDesignerStateService.hasFormMeta();
    }

    dispose(): void {
    }
}