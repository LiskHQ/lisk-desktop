import React, { Fragment, createElement } from 'react';
import regex from './regex';

const htmlParser = (html = '') => {
  const elements = html.match(new RegExp(regex.htmlElements, 'g'));
  if (!elements) return html;
  return (
    <Fragment>
      {
      elements.map((element, index) => {
        const [tag, content, rest] = element.match(regex.htmlElements).slice(1);
        return (
          <Fragment key={`${tag}-${index}`}>
            {createElement(tag, { key: `${tag}-${index}` }, htmlParser(content))}
            {!!rest && rest}
          </Fragment>
        );
      })
    }
    </Fragment>
  );
};

export default htmlParser;
