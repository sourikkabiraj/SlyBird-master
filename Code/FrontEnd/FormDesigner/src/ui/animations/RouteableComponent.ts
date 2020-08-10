

import { OnInit } from '@angular/core';
import { RouteTransition } from "ui/animations/RouteAnimation";

export class RouteableComponent implements OnInit {
    state:string = 'in';

    ngOnInit(): void {
      this.state = (this.state === 'in'? 'in':'out');
    }

    
    public static getAnimation():any{
      return RouteTransition;
    }


  constructor() {
      
   }

}
