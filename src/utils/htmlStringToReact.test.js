import { mount } from 'enzyme';
import htmlStringToReact from './htmlStringToReact';

describe('htmlStringToReact util', () => {
  it('Should return a valid React element', () => {
    const dummyHtml = `<div>
      <h1>Dummy title</h1>
      <span>
        <p>before <strong>Nested</strong> tags</p>
        <a href="https://github.com/LiskHQ/lisk-desktop/issues/1234">#1234</a>
      </span>
      <ul>
        <li>sibling</li>
        <li>sibling</li>
      </ul>
    </div>`;

    const wrapper = mount(htmlStringToReact(dummyHtml));

    expect(wrapper.html()).toEqual(dummyHtml);
  });

  it('Should return a clean and valid React element', () => {
    const dirtyDummyHtml = `<div>
      <h1>Dummy title</h1>
      <p onclick=alert(0)>
        <span>before <strong>Nested</strong> tags</span>
        <a href="javascript:alert(1)">#1234</a>
      </p>
    </div>`;

    const cleanDummyHtml = `<div>
      <h1>Dummy title</h1>
      <p>
        <span>before <strong>Nested</strong> tags</span>
        <a href="https://github.com/LiskHQ/lisk-desktop/issues/1234">#1234</a>
      </p>
    </div>`;

    const wrapper = mount(htmlStringToReact(dirtyDummyHtml));

    expect(wrapper.html()).toEqual(cleanDummyHtml);
  });

  it('Should return empty node if no html string provided', () => {
    expect(htmlStringToReact()).toEqual([]);
  });
});
