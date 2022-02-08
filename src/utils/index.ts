import sharp from 'sharp';

export function loadImage(path: string) {
  return sharp(path);
}
