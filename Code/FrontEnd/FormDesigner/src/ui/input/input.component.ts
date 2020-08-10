
import { Component, OnInit, Input } from '@angular/core';
import { UIComponentBase } from "ui/UIComponentBase";

@Component({
  selector: 'fd-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent extends UIComponentBase implements OnInit {
  
  @Input() placeholderText:String;
  
  @Input() value:String = '';

  
  @Input() type:String = "text";
  

  constructor() {
    super();
    
   }

  ngOnInit(): void {
      super.ngOnInit();
    }

  getStyles():String[]{
    let styles:String[] = [];
    styles.push(this.styles);
    styles.push("mat-input-element");

    return styles;
  }

}
