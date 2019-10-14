import {relative} from "path";

const getRelativeLink = (from: string, to: string) => {
    const fromDir = from.split('/').slice(0, -1).join('/');
    return relative(fromDir, to);
}

export default getRelativeLink;
