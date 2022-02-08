import { createUnplugin } from 'unplugin';
// import { loadImage } from './utils';
// import { parseURL } from './utils/parseImport';

const resourceRegex = / (.*\.(jpeg|jpg|mpc|mps|mpb|cxc|cxs|cxb|png|tga))/g;
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
  const matches = contents.match(resourceRegex);

  /* if no external resources, return original raw contents and set extRef to false */
  if (!matches) {
    return `
    export const mtl = \`${contents}\`
    export const extRef = false;
  `;
  }

  /* define var holding list of import statements for external resources */
  const imports: string[] = [];
  //const extRefData: Record<string, ExtRefData> = {};

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
    /*
      const imgPath = parseURL(trimmedMatches[i]).pathname;
      const image = await loadImage(imgPath);
      const { width, height } = await image.metadata();
      if (!width)
        throw new Error(
          `Error: sharp could not determine width of : ./${trimmedMatches[i]} `
        );

      if (!height)
        throw new Error(
          `Error: sharp could not determine height of : ./${trimmedMatches[i]} `
        );
      extRefData[`asset${i}`] = {
        src: `asset${i}`,
        width,
        height,
      };
    */
  }

  return `
    ${imports.join('\n')}
    export const mtl = ${replacedContents};
    export const extRef = true;
  `;
}
