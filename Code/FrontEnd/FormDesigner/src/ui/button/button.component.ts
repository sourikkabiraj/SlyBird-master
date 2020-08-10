

import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { UIComponentBase } from "ui/UIComponentBase";

@Component({
  selector: 'fd-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  
})
export class ButtonComponent extends UIComponentBase implements OnInit {
  @Input() text:String;
  
  @Output() notifyClick: EventEmitter<string> = new EventEmitter<string>();

  constructor() { super(); }

  ngOnInit(): void {
      super.ngOnInit();
    }

  
  onClick(e:any){
    this.notifyClick.emit('');
  }

  getStyles():String[]{
    let styles:String[] = [];
    styles.push(this.styles);
    styles.push("mat-raised-button");

    return styles;
  }

}
