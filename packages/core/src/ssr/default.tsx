import React from 'react';
import ReactDOMServer from 'react-dom/server';
import parse from 'html-react-parser';
import cheerio from 'cheerio';
import {
  extractHeadElements,
  convertAttrToJsxStyle,
} from '../helpers/head';
import { SsrProps } from './interfaces';

export default function Ssr(props: SsrProps) {
  const {
    children,
    script,
  } = props;

  const {
    Title,
    MetaDescription,
  } = extractHeadElements(children);

  const html = ReactDOMServer.renderToString(children);
  const withHtml = 0 <= html.toLowerCase().indexOf('html');

  if (withHtml) {
    const $ = cheerio.load(html);
    const meta = $.html($('head meta').filter((i, el) => $(el).attr('name') !== 'description'));
    const styles = $.html($('head style'));
    const body = $('body').html();

    return (
      <html {...convertAttrToJsxStyle($('html').attr())}>
        <head>
          {Title ? <Title /> : parse($.html($('title')))}
          {MetaDescription ? <MetaDescription /> : parse($.html($('meta[name=description]')))}
          {parse(meta)}
          {parse(styles)}
        </head>
        <body {...convertAttrToJsxStyle($('body').attr())}>
          {body ? parse(body) : null}
          <script src={script}></script>
        </body>
      </html>
    );
  } else {
    return (
      <html>
        <head>
          {Title && <Title />}
          {MetaDescription && <MetaDescription />}
        </head>
        <body>
          <div id="react-ssr-root">
            {children}
          </div>
          <script src={script}></script>
        </body>
      </html>
    );
  }
};
