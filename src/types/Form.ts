export interface ICreateInsurancePolicyFormRequest {
    title?: string | null;
    description?: string | null;
    assignToCategoryId?: number | null;
    fields?: IInsurancePolicyFormField[] | null
}


export interface IInsurancePolicyFormField {
    title?: string;
    description?: string;
    formFieldTypeId?: number | null;
    displayOrder?: number;
    defaultValue?: string | null;
    dataOption?: string;
    isRequired?: boolean
}


export enum FormFieldType {
    Text = 1,
    Number = 2,
    List = 3,
    MotorcyclePlate = 4,
    CarPlate = 5,
    NationalCode = 6,
    PhoneNumber = 7,
    Date = 8,
    Vehicle = 9,
    People = 10,
    File = 11,
    MotorcycleType = 12
}

export interface IFormPolicyResponse {
    id: number;
    title?: string | null;
    description?: string | null;
    category: string;
    categoryId: number,
    fields: IFormFieldPolicyResponse[]
}


export interface IFormFieldPolicyResponse {
    id: number;
    title: string;
    description: string;
    formFieldTypeId: FormFieldType;
    formFieldTypeTitle: string;
    displayOrder: number;
    defaultValue: string;
    dataOption: string;
    jsonDataOption: string;
    isRequired: boolean,
    canFieldEdit: boolean,
    file: IFormFieldFileInfo
}

export interface IFormFieldPolicyRequest {
    id: number | null
    title: string | null;
    description: string | null;
    formFieldTypeId: FormFieldType | null;
    displayOrder: number;
    defaultValue: string | null;
    dataOption: string | null;
    isRequired?: boolean
}

export interface IFieldDataOption {
    id: number,
    title: string
}

export interface IFormFieldValue {
    /**شناسه فیلد */
    id: number,
    /**مقدار فیلد */
    value: string | null,
    /**برای نوع فایل */
    file?: File | null,
    /** اجباری بودن */
    isRequired?: boolean
}

export interface IFormFieldFileInfo {
    content: any;
    contentType: string;
    extension: string;
    size: number;
    isCompressed: boolean;
    name: string;
}

export enum MotorcycleType {
    Singlecylinder = 1,
    TwocylindersAbove = 2,
    Threewheels = 3,
    Electric = 4,
}