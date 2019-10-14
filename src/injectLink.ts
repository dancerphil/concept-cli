import {readFileSync, writeFileSync, ensureFileSync} from 'fs-extra';
import {uniq, fromPairs} from 'lodash';
import {Node} from 'unist';
import * as remark from 'remark';
import getRelativeLink from './getRelativeLink';
import {File, ConceptName, FileOfConcept, UsageListOfFileTarget} from './types';

const getConceptOrder = (fileOfConcept: FileOfConcept) => {
    const conceptOrder = Object.keys(fileOfConcept);
    conceptOrder.sort((a, b) => b.length - a.length);
    return conceptOrder;
}

// 单次运行，使用一个全生命周期闭包
const usageListOfFileTarget: UsageListOfFileTarget = {}

const pushUsage = (conceptDefinition: File['target'], target: File['target']) => {
    if(!usageListOfFileTarget[conceptDefinition]) {
        usageListOfFileTarget[conceptDefinition] = []
    }
    usageListOfFileTarget[conceptDefinition].push(target);
}

const {parse, process, stringify} = remark()

const injectLinkOfFile = (file: File, fileOfConcept: FileOfConcept, conceptOrder: ConceptName[]) => {
    const {source, target} = file

    const transformChildren = (state: Node[], node: Node) => {
        switch (node.type) {
            case 'heading' :
            case 'link': {
                state.push(node);
                return state;
            }
            case 'text': {
                let nodeList = [node];

                conceptOrder.forEach((conceptName) => {
                    const {target: conceptDefinition} = fileOfConcept[conceptName];
                    const linkUrl = getRelativeLink(target, conceptDefinition);

                    let found = false
                    const reducer = (state: Node[], node: Node) => {
                        if (node.type !== 'text') {
                            state.push(node);
                            return state
                        }

                        const value = node.value as string;

                        const index = value.indexOf(conceptName);
                        if (index !== -1) {
                            pushUsage(conceptDefinition, target);
                            found = true;
                            state.push(
                                {type: 'text', value: value.slice(0, index)},
                                {type: 'link', url: linkUrl, children: [{type: 'text', value: conceptName}]},
                                {type: 'text', value: value.slice(index + conceptName.length)},
                            )
                        } else {
                            state.push(node);
                        }
                        return state;
                    }

                    nodeList = nodeList.reduce(reducer, [])
                });

                state.push(...nodeList)
                return state
            }
            default: {
                if (Array.isArray(node.children)) {
                    node.children = node.children.reduce(transformChildren, [])
                }
                state.push(node);
                return state;
            }
        }
    }

    process(readFileSync(source, 'utf-8'), (error, vfile) => {
        const node = parse(vfile);

        if (Array.isArray(node.children)) {
            node.children = node.children.reduce(transformChildren, [])
        }
        const output = stringify(node)

        ensureFileSync(target);
        writeFileSync(target, output, 'utf-8');
    })
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
