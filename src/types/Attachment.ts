export interface IAttachmentTypeResponse {
    id: number;
    name: string;
    description: string;
    maxFileSize: number | null;
    allowedExtensions: string[];
    allowedMimeTypes: string[];
    isRequired: boolean;
    applicableEntity: string;
    validationRegex: string;
    maxCountPerEntity: number | null;
    isActive: boolean;
    isUniqueRecord: boolean
}

export interface IAttachmentTypeRequest {
    id: number | null;
    name: string;
    description: string | null;
    maxFileSize: number | null;
    allowedExtensions: string[];
    allowedMimeTypes: string[]
    applicableEntity: string;
    validationRegex: string | null;
    maxCountPerEntity: number | null;
    isRequired: boolean;
    isActive: boolean;
    isUniqueRecord: boolean
}


export interface IAttachmentUploadRequest {
    title: string | null;
    description: string | null;
    entityId: number | null;
    attachmentTypeId: number | null;
    file: File | null;
}

export interface IAttachmentResponse {
    id: number
    accessKey: string
    attachmentTypeName: string
    fileContent: any,
    fileContentType: string
}