export default class FormHelper{
    public static getFormControlState(value:any,disabled:boolean):any{
         return {
            value:value,
            disabled:disabled
        };
    }
}