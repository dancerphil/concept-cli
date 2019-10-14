import {readFileSync} from 'fs-extra';
import warnIf from './warnIf';
import {File, FileOfConcept} from './types';

// 单次运行，使用一个全生命周期闭包
const fileOfConcept: FileOfConcept = {};

const collectConceptOfFile = (file: File) => {
    const {source} = file;
    const lines = readFileSync(source, 'utf-8').split('\n');
    lines.forEach((line) => {
        if (!line.startsWith('# ')) {
            return;
        }

        warnIf(
            line.includes('|') && !line.includes(' | '),
            'separator | should have spaces between'
        );

        const conceptNames = line.slice(2).split(' | ');
        conceptNames.forEach(conceptName => {
            fileOfConcept[conceptName] = file
        })
    })
}

const collectConcept = (files: File[]) => {
    files.forEach(collectConceptOfFile)

    return fileOfConcept;
}

export default collectConcept
