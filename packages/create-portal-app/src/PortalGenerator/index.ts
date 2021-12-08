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
      path: join(__dirname, '../../templates/portal'),
      target: this.cwd,
    });

    console.log(
      '\nThe boom💣has been planted. version：@%s',
      chalk.cyan(version),
    );
  }
}
