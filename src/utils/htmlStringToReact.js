import React, { Fragment, createElement } from 'react';
import regex from './regex';

const normalizeProp = prop => ({
  class: 'className',
}[prop] || prop);

const attributesToProps = attributes =>
  (attributes.match(new RegExp(regex.htmlAttributes, 'g')) || []).reduce((props, attrib) => {
    const [prop, value] = attrib.match(regex.htmlAttributes).slice(1);
    props[normalizeProp(prop)] = encodeURIComponent(value);
    return props;
  }, {});

const htmlStringToReact = (html = '') => {
  const trimmedHtml = html.trim();
  const elements = trimmedHtml.match(new RegExp(regex.htmlElements, 'g'));
  if (!elements) return trimmedHtml;
  const before = trimmedHtml.slice(0, trimmedHtml.indexOf(elements[0]));
  return (
    <Fragment>
      {
      elements.map((element, index) => {
        const [tag, attributes, content, after] = element.match(regex.htmlElements).slice(1);
        const props = attributesToProps(attributes);
        return (
          <Fragment key={`${tag}-${index}`}>
            {!!before && before}
            {createElement(tag, { ...props, key: `${tag}-${index}` }, htmlStringToReact(content))}
            {!!after && after}
          </Fragment>
        );
      })
    }
    </Fragment>
  );
};

export default htmlStringToReact;
