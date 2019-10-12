export type FileName = string;
export type ConceptName = string;
export type Usage = {
    conceptName: ConceptName,
    fileName: FileName,
};

export interface FileNameOfConcept {
    [key: string]: FileName
}

export interface UsageListOfFileName {
    [key: string]: Usage[]
}
