

import { IStorageProvider } from "shared/storage/IStorageProvider";
import { LocalStorageProvider } from "shared/storage/LocalStorageProvider";

export class StorageProviderFactory {
    public static getStorageProvider(){
        let provider:IStorageProvider = null;

          provider = new LocalStorageProvider();

        return provider;
    }
}