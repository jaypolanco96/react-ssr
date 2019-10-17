import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SSR from './ssr';
import { getEngine } from './utils';

const ext = '.' + getEngine();
const codec = require('json-url')('lzw');

const render = async (file: string, props: object): Promise<string> => {
  const [, ...rest] = file.replace(process.cwd(), '').replace(ext, '.js').split(path.sep);
  const script = `/_react-ssr/${rest.join('/')}?props=${await codec.compress(props)}`;

  let Page = require(file);
  Page = Page.default || Page;

  let html = '<!DOCTYPE html>';
  html += ReactDOMServer.renderToString(
    <SSR script={script}>
      <Page {...props} />
    </SSR>
  );

  return html;
};

export default render;