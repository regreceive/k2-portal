import { cleanup } from '@testing-library/react';
import { statSync } from 'fs';
import { join } from 'path';
import { Service } from 'umi';

const fixtures = join(__dirname, 'fixtures');

afterEach(() => {
  cleanup();
});

test('normal', async () => {
  process.env.NODE_ENV = 'test';
  const cwd = join(fixtures, 'normal');
  const service = new Service({
    cwd,
    plugins: [require.resolve('./')],
  });
  await service.run({
    name: 'g',
    args: {
      _: ['g', 'tmp'],
    },
  });

  const result = statSync(join(cwd, 'src', '.umi-test', 'plugin-portal'));

  expect(result.isDirectory()).toBeTruthy();
});
