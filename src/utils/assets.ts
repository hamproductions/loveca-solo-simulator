import { join } from 'path-browserify';

export const assetsURL = import.meta.env.PUBLIC_ENV__BASE_URL + 'assets/';

export const getAssetUrl = (path: string) => {
  return join(import.meta.env.PUBLIC_ENV__BASE_URL ?? '', path);
};
