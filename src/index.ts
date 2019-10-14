#!/usr/bin/env node

import {sync} from 'glob';
import collectConcept from './collectConcept';
import injectLink from './injectLink';
import injectUsage from './injectUsage';

const sourceDir = 'docs';

const targetDir = '.docs';

const getFile = (sourceFile: string) => {
    return {
        source: sourceFile,
        target: targetDir + sourceFile.slice(sourceDir.length)
    };
}

const run = () => {
    const sourceFiles = sync(sourceDir + '/**/*.md', {nodir: true});
    const files = sourceFiles.map(getFile);
    const fileOfConcept = collectConcept(files);

    console.log('concept collected: ', fileOfConcept);

    // 可以在 injectLink 的时候 not self，也可以在 injectUsage 的时候 not self，现在选择了后者
    const usageListOfFile = injectLink(files, fileOfConcept)

    console.log('usage collected: ', usageListOfFile);

    // 可以在 injectLink 的时候 not self，也可以在 injectUsage 的时候 not self，现在选择了后者
    injectUsage(usageListOfFile)
}

run();
