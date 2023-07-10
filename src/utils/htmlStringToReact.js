import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

const htmlStringToReact = (html = '') => {
  const trimmedHtml = html.trim();
  const cleanHtml = DOMPurify.sanitize(trimmedHtml, { USE_PROFILES: { html: true } });
  return parse(cleanHtml, {
    replace: (domNode) => {
      const content = domNode.firstChild?.data;
      // Update link if issue number is added without related link
      if (
        domNode.name === 'a' &&
        domNode.firstChild?.type === 'text' &&
        !domNode.attribs.href &&
        /#\d+$/.test(content)
      ) {
        domNode.attribs.href = `https://github.com/LiskHQ/lisk-desktop/issues/${content.replace(
          /\D/g,
          ''
        )}`;
      }
      return domNode;
    },
  });
};

export default htmlStringToReact;
