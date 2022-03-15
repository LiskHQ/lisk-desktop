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

    expect(wrapper).toHaveHTML(dummyHtml);
  });

  it('Should return empty string if no html provided', () => {
    expect(htmlStringToReact()).toEqual('');
  });
});
