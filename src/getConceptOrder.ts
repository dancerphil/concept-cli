import {FileOfConcept} from "./types";

const getConceptOrder = (fileOfConcept: FileOfConcept) => {
    const conceptOrder = Object.keys(fileOfConcept);
    conceptOrder.sort((a, b) => b.length - a.length);
    return conceptOrder;
}

export default getConceptOrder;
