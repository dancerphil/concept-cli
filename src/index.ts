#!/usr/bin/env node

import {sync} from 'glob';
import collectConcept from './collectConcept';
import injectLink from './injectLink';
import injectUsage from './injectUsage';

const run = () => {
    const fileNames = sync('docs/**/*.md', {nodir: true});
    const fileNameOfConcept = collectConcept(fileNames);

    console.log('收集到以下概念', Object.keys(fileNameOfConcept));

    const usageListOfFileName = injectLink(fileNames, fileNameOfConcept)
    injectUsage(usageListOfFileName)
}

run();
