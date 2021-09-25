import { chalk, Generator } from '@umijs/utils';
import { join } from 'path';

export default class AppGenerator extends Generator {
  async writing() {
    const version = require('../../package').version;

    this.copyDirectory({
      context: {
        version,
        conventionRoutes: this.args.conventionRoutes,
      },
      path: join(__dirname, '../../templates/app'),
      target: this.cwd,
    });

    console.log('\n子应用模板创建完成，版本：@%s', chalk.cyan(version));
  }
}
