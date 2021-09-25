import { yargs } from '@umijs/utils';
import AppGenerator from './AppGenerator';
import PortalGenerator from './PortalGenerator';

export default async ({
  cwd,
  args,
}: {
  cwd: string;
  args: yargs.Arguments;
}) => {
  if (args.portal) {
    const generator = new PortalGenerator({
      cwd,
      args,
    });
    await generator.run();
    return;
  }

  const generator = new AppGenerator({
    cwd,
    args,
  });
  await generator.run();
};
