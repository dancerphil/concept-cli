import {readFileSync, writeFileSync, ensureFileSync} from 'fs-extra';
import {uniq, fromPairs} from 'lodash';
import getRelativeLink from './getRelativeLink';
import {File, ConceptName, FileOfConcept, UsageListOfFileTarget} from './types';

const getConceptOrder = (fileOfConcept: FileOfConcept) => {
    const conceptOrder = Object.keys(fileOfConcept);
    conceptOrder.sort((a, b) => b.length - a.length);
    return conceptOrder;
}
// 识别 [...](...) 语法
const linkRegex = /\[[^\[\]]*]\([^()]*\)/g

// 单次运行，使用一个全生命周期闭包
const usageListOfFileTarget: UsageListOfFileTarget = {}

const regenerateLine = (content: string[], line: string) => {
    let formattedLine = content[0]
    let contentIndex = 1;
    for (let result = linkRegex.exec(line); result !== null; result = linkRegex.exec(line)) {
        formattedLine += result[0] + content[contentIndex];
        contentIndex += 1;
    }
    return formattedLine;
}

const injectLinkOfFile = (file: File, fileOfConcept: FileOfConcept, conceptOrder: ConceptName[]) => {
    const {source, target} = file
    let outputLines = readFileSync(source, 'utf-8').split('\n');

    conceptOrder.forEach((conceptName) => {
        let hasFound = false;
        const {target: conceptDefinition} = fileOfConcept[conceptName];
        const linkUrl = getRelativeLink(target, conceptDefinition);

        outputLines = outputLines.map((line) => {
            if (line.startsWith('#')) {
                return line;
            }
            const content = line.split(linkRegex).map(str => {
                // 这个写法只会 replace 同一行第一个，我觉得它是个 feature 挺好的
                const replacedStr =  str.replace(
                    conceptName,
                    `[${conceptName}](${linkUrl})`
                )
                if (replacedStr !== str) {
                    hasFound = true;
                }
                return replacedStr;
            })
            return regenerateLine(content, line);
        });

        if (hasFound) {
            if (!usageListOfFileTarget[conceptDefinition]) {
                usageListOfFileTarget[conceptDefinition] = [];
            }
            usageListOfFileTarget[conceptDefinition].push(target);
        }
    });
    ensureFileSync(target);
    writeFileSync(target, outputLines.join('\n'), 'utf-8');
}

const injectLink = (files: File[], fileOfConcept: FileOfConcept) => {
    const conceptOrder = getConceptOrder(fileOfConcept);

    files.forEach((file) => {
        injectLinkOfFile(file, fileOfConcept, conceptOrder)
    })

    return fromPairs(
        Object.entries(usageListOfFileTarget)
            .map(([key, usageList]) => {
                const filteredUsageList = uniq(usageList.filter(item => item !== key))
                return [key, filteredUsageList];
            })
            .filter(([key, usageList]) => usageList.length > 0)
    );
}

export default injectLink
