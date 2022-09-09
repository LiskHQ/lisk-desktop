import React, { Fragment, createElement } from 'react';
import { regex } from 'src/const/regex';

const htmlStringToReact = (html = '') => {
  const trimmedHtml = html.trim();
  const elements = trimmedHtml.match(new RegExp(regex.htmlElements, 'g'));
  if (!elements) return trimmedHtml;
  const before = trimmedHtml.slice(0, trimmedHtml.indexOf(elements[0]));
  return (
    <>
      {elements.map((element, index) => {
        const [tag, content, after] = element.match(regex.htmlElements).slice(1);
        const props =
          tag === 'a' && /#\d+$/.test(content)
            ? {
                href: `https://github.com/LiskHQ/lisk-desktop/issues/${content.replace(/\D/g, '')}`,
              }
            : {};
        return (
          <Fragment key={`${tag}-${index}`}>
            {!!before && before}
            {createElement(tag, { ...props, key: `${tag}-${index}` }, htmlStringToReact(content))}
            {!!after && ' '}
            {!!after && htmlStringToReact(after)}
          </Fragment>
        );
      })}
    </>
  );
};

export default htmlStringToReact;
