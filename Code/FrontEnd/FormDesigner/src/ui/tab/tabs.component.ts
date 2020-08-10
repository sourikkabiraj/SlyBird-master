import { Component, OnInit, Input, ContentChildren, QueryList } from '@angular/core';
import { UITabComponent } from "ui/tab/tab.component";

@Component({
  selector: 'fd-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class UITabsComponent implements OnInit {
  
    @ContentChildren(UITabComponent) _tabs:QueryList<UITabComponent>;
  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit():void{
        
    }

}
