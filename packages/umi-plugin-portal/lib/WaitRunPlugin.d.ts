import { Compiler } from 'webpack';
declare type Options = {
    test: RegExp;
    initFile?: string;
};
declare class WaitRunPlugin {
    private options;
    constructor(options: Options);
    wrapContent(assets: any): string[];
    apply(compiler: Compiler): void;
}
export default WaitRunPlugin;
