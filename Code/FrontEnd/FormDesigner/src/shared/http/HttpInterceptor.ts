

import { Http, ConnectionBackend,XHRBackend,Request, RequestOptions,Response, RequestOptionsArgs } from "@angular/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { StorageProviderFactory } from "shared/storage/StorageProviderFactory";
import { KeyValuePair } from "shared/models/KeyValuePair";

@Injectable()
export class HttpInterceptor extends Http {
    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions){
        super(backend,defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response>{
          let storageProvider = StorageProviderFactory.getStorageProvider();
        let kv:KeyValuePair = storageProvider.get('x-auth-userid');
        if(kv){
            options.headers.append("x-auth-userid",kv.value);
        }

        return super.request(url,options);
    }
}