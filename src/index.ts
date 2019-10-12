#!/usr/bin/env node

import {sync} from 'glob';
import collectConcept from './collectConcept';
import getConceptOrder from './getConceptOrder';
import injectLink from './injectLink';
import injectUsage from './injectUsage';

const run = () => {
    const files = sync('docs/**/*.md', {nodir: true});
    const fileOfConcept = collectConcept(files);

    const conceptOrder = getConceptOrder(fileOfConcept);
    console.log('concept collected: ', conceptOrder);

    // 可以在 injectLink 的时候 not self，也可以在 injectUsage 的时候 not self，现在选择了后者
    const usageListOfFile = injectLink(files, fileOfConcept, conceptOrder)

    console.log('usage collected: ', usageListOfFile);

    // 可以在 injectLink 的时候 not self，也可以在 injectUsage 的时候 not self，现在选择了后者
    injectUsage(usageListOfFile)
}

run();
