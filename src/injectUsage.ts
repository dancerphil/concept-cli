import {parse} from 'path';
import {readFileSync, writeFileSync} from "fs-extra";
import getRelativeLink from "./getRelativeLink";
import {UsageListOfFileTarget} from './types';

const injectUsage = (usageListOfFileTarget: UsageListOfFileTarget) => {
    Object.entries(usageListOfFileTarget).forEach(([file, usageList]) => {

        let outputLines = readFileSync(file, 'utf-8').split('\n');

        outputLines.push('---');
        outputLines.push('');
        outputLines.push('## Usage');
        outputLines.push('');

        usageList.forEach(usage => {
            const {name} = parse(usage);
            const linkUrl = getRelativeLink(file, usage);
            outputLines.push(`[${name}](${linkUrl})`);
            outputLines.push('');
        })

        writeFileSync(file, outputLines.join('\n'), 'utf-8');
    })
}

export default injectUsage;
