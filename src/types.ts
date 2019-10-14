export interface File {
    source: string;
    target: string;
}
export type ConceptName = string;

export interface FileOfConcept {
    [key: string]: File
}

export interface UsageListOfFileTarget {
    [key: string]: string[]
}
