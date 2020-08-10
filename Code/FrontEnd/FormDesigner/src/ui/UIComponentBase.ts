
import { Input } from "@angular/core";

export abstract class UIComponentBase {
    
  @Input() controlName:String;
  
  @Input() controlGroup:String;

  
  @Input() styles:String;
  
  _usesReactive:Boolean = false;

  ngOnInit(){
      if(this.controlName && this.controlGroup){
        this._usesReactive = true;
      }
  }
}