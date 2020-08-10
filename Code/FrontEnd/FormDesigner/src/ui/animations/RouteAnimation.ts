

import { trigger, state, style, transition, animate } from "@angular/core";


export const RouteTransition = 
    trigger('routeTransition',[
      state('in',style({transform:'translateY(0px)',opacity:'1'})),
      transition('void => *',[
        style({transform:'translateY(30px)',opacity:'1'}),
        animate('1000ms ease-out')
      ])
    ]);