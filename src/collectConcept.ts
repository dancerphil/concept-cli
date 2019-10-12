import {readFileSync} from 'fs';
import warnIf from './warnIf';
import {FileName, FileNameOfConcept} from './types';

// 单次运行，使用一个全生命周期闭包
const fileNameOfConcept: FileNameOfConcept = {};

const collectConceptOfFile = (fileName: FileName) => {
    const lines = readFileSync(fileName, 'utf-8').split('\n');
    lines.forEach((line) => {
        const isTitle = line.startsWith('# ')
        warnIf(
            line.startsWith('#') && !isTitle,
            'h1 should startsWith a space after #'
        )
        if (!isTitle) {
            return;
        }

        warnIf(
            line.includes('|') && !line.includes(' | '),
            'separator | should have spaces between'
        );
        const conceptNames = line.slice(2).split(' | ');
        conceptNames.forEach(conceptName => {
            fileNameOfConcept[conceptName] = fileName
        })
    })
}

const collectConcept = (fileNames: FileName[]) => {
    fileNames.forEach(collectConceptOfFile)

    return fileNameOfConcept;
}

export default collectConcept
