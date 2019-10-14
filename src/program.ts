import * as program from "commander";

program
    .option('--sourceDir <sourceDir>', '', 'docs')
    .option('--targetDir <targetDir>', '', '.docs')

program.parse(process.argv)

export default program;
