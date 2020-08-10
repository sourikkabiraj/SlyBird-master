import { Component, OnInit, Input } from '@angular/core';
import { UIFieldBase } from "formrenderer/controls/uifield-base";



@Component({
    selector:'text-box',
    templateUrl:'./shorttext-field.component.html',
     styleUrls:['../control-styles.scss']
})
export class ShortTextUIFieldComponent extends UIFieldBase implements OnInit{

    ngOnInit():void{
        
    }
     getStyles():String{
        return "field-inner";
    }
}