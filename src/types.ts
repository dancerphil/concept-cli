type Source = string;
type Target = string;

export interface File {
    source: Source;
    target: Target;
}
export type ConceptName = string;

export interface FileOfConcept {
    [key: string]: File
}

export interface UsageListOfFileTarget {
    [key: string]: Target[]
}
