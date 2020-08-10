import {Injectable} from '@angular/core';
import {UUID} from 'angular2-uuid';


@Injectable()
export class IdService{

    
    public nextId():string{
        return UUID.UUID();
    }    
}