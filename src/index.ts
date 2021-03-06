#!/usr/bin/env node

import {sync} from 'glob';
import program from './program';
import collectConcept from './collectConcept';
import injectLink from './injectLink';
import injectUsage from './injectUsage';

const {sourceDir, targetDir} = program;

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

    const usageListOfFile = injectLink(files, fileOfConcept);

    injectUsage(usageListOfFile);
}

run();
