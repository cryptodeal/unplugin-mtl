import { createUnplugin } from 'unplugin';

/**
 * Bundler-agnostic plugin for importing .mtl files as strings.
 */
export default createUnplugin(() => {
  const mtlRegex = /\.mtl\??/;

  return {
    name: 'unplugin-mtl',
    resolveId(id: string) {
      if (id.match(mtlRegex)) {
        return id;
      }
    },
    transform(src: string, id: string) {
      if (id.endsWith('.mtl')) {
        const contents = String.raw`${src}`;

        return {
          code: getCode(contents),
          map: null,
        };
      }
    },
  };
});

function getCode(contents: string) {
  return `
    const mtl = \`${contents}\`;
    export default mtl;
  `;
}
