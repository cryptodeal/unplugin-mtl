interface ExtRefData {
  width: number;
  height: number;
  src: string;
}

declare module '*.mtl' {
  const mtl: string;
  const extRef: boolean;
  const extRefHelpers: Record<string, ExtRefData>;
  export { mtl, extRef, extRefHelpers };
}
