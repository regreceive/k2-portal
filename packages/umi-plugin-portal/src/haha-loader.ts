// @ts-ignore
import less from '@umijs/deps/compiled/less';

const schema = {
  title: 'haha loader options',
  type: 'object',
  properties: {
    scope: {
      description: 'root element your app based, allow class(.xxx) or id(#xxx)',
      anyOf: [
        {
          type: 'string',
        },
      ],
    },
  },
};

async function hahaLoader(content: any, map: any, meta: any) {
  // @ts-ignore
  const callback = this.async();
  // @ts-ignore
  const options = this.getOptions(schema);
  // @ts-ignore
  if (this.resourcePath.endsWith('default.less')) {
    // .anticon是分界点
    const pos = content.indexOf('.anticon');
    if (pos < 0) {
      return callback(null, content, map, meta);
    }
    const globalCss = content.slice(0, pos);
    const restCss = content.slice(pos);

    const nextGlobalCss = globalCss
      .replace(/html(?= \[)/, '') // html [type="button"] => [type="button"]
      .replace(/html|body/g, 'hahahaha')
      .replace(/(?=hahahaha)/, `.el-${options.scope} {`)
      .replace(/hahahaha[^\{\}]*\{([^\}]*)\}/g, '$1') // html,body的样式分离出来
      .replaceAll('color: inherit;', ''); // 加scope以后，样式优先级变高，去掉一些不必要的属性

    // fs.writeFile('d:\\aa.less', nextGlobalCss + '}' + restCss, function (err) {
    //   console.log(err);
    // });

    const result = await less.render(nextGlobalCss + '}' + restCss);
    return callback(null, result.css, map, meta);
  }

  callback(null, content, map, meta);
}

export default hahaLoader;
