import { createUnplugin } from 'unplugin';
import { loadImage } from './utils';
import { parseURL } from './utils/parseImport';
import path from 'path';

const resourceRegex =
  / (.*\.(jpeg|jpg|mpc|mps|mpb|cxc|cxs|cxb|png|tga|webp|avif|tiff))/g;
const mtlRegex = /\.mtl\??/;

/**
 * Bundler-agnostic plugin for importing .mtl files as strings.
 */
export default createUnplugin(() => {
  return {
    name: 'unplugin-mtl',
    resolveId(id: string) {
      if (id.match(mtlRegex)) {
        return id;
      }
    },
    async transform(src: string, id: string) {
      if (id.endsWith('.mtl')) {
        const contents = String.raw`${src}`;
        const code = await getCode(contents, id);
        if (code) {
          return {
            code: code,
            map: null,
          };
        }
      }
    },
  };
});

async function getCode(contents: string, id: string) {
  const matches = contents.match(resourceRegex);

  /* if no external resources, return original raw contents and set extRef to false */
  if (!matches) {
    return `
    export const mtl = \`${contents}\`
    export const extRef = false;
    export const extRefHelpers = [];
  `;
  }

  const idURL = parseURL(id).pathname;
  /* define var holding list of import statements for external resources */
  const imports: string[] = [];
  const extRefData: string[] = [];

  /* remove duplicates from list of matches */
  const uniqueMatches = matches.filter(
    (value, index, self) => self.indexOf(value) === index
  );

  /* remove whitespace at first char */
  const trimmedMatches = uniqueMatches.map((item) => item.trim());

  /** Iterate over matches:
   * - replace instance of filename with ref to imported img.src
   * - append import for the relevant matched texture/image as a incremental var, asset${i}
   */
  let replacedContents = `\`${contents}\``;
  for (let i = 0; i < trimmedMatches.length; i++) {
    replacedContents = replacedContents.replace(
      new RegExp(trimmedMatches[i], 'g'),
      '${' + 'asset' + i + '}'
    );
    imports.push(`import asset${i} from './${trimmedMatches[i]}';`);
    const image = await loadImage(
      path.dirname(idURL) + '/' + trimmedMatches[i]
    );
    const metadata = await image.metadata();
    if (metadata) {
      const imgData = `{
        src: asset${i},
        width: ${metadata.width},
        height: ${metadata.height},
      }`;
      extRefData.push(imgData);
    }
  }

  return `
    ${imports.join('\n')}
    export const mtl = ${replacedContents};
    export const extRef = true;
    export const extRefHelpers = [${extRefData}];
  `;
}
