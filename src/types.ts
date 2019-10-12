export type File = string;
export type ConceptName = string;

export interface FileOfConcept {
    [key: string]: File
}

export interface UsageListOfFile {
    [key: string]: File[]
}
