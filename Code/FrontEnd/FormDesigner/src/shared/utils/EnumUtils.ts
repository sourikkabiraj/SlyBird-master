

export class EnumUtils{
    
    static getEnumString(enumObj:any, enumValue:any){
        var isValueProperty = parseInt(enumValue, 10) >= 0
        if (isValueProperty) {
            return enumObj[enumValue];
        }
        return "";
    }
}