import React, { Fragment, createElement } from 'react';
import regex from './regex';

const htmlParser = (html = '') => {
  const trimmedHtml = html.trim();
  const elements = trimmedHtml.match(new RegExp(regex.htmlElements, 'g'));
  if (!elements) return trimmedHtml;
  const before = trimmedHtml.slice(0, trimmedHtml.indexOf(elements[0]));
  return (
    <Fragment>
      {
      elements.map((element, index) => {
        const [tag, content, after] = element.match(regex.htmlElements).slice(1);
        return (
          <Fragment key={`${tag}-${index}`}>
            {!!before && before}
            {createElement(tag, { key: `${tag}-${index}` }, htmlParser(content))}
            {!!after && after}
          </Fragment>
        );
      })
    }
    </Fragment>
  );
};

export default htmlParser;
