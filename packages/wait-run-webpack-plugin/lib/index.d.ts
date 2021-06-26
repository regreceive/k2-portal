import { Compiler } from 'webpack';
declare type Options = {
    test: RegExp;
};
declare class WaitRunPlugin {
    private options;
    constructor(options: Options);
    apply(compiler: Compiler): void;
}
export default WaitRunPlugin;
