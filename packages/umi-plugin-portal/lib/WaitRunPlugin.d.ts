import { Compiler } from 'webpack';
declare type Options = {
    test: RegExp;
};
declare class WaitRunWebpackPlugin {
    private options;
    constructor(options: Options);
    wrapContent(assets: any): string[];
    apply(compiler: Compiler): void;
}
export default WaitRunWebpackPlugin;
