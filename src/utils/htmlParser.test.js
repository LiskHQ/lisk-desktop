import { mount } from 'enzyme';
import htmlParser from './htmlParser';

describe('html parser util', () => {
  it('Should return a valid React element', () => {
    const dummyHtml = `<div>
      <h1>Dummy title</h1>
      <span>
        <p>before <strong>Nested</strong> tags</p>
      </span>
    </div>`;

    const wrapper = mount(htmlParser(dummyHtml));

    expect(wrapper).toHaveHTML(dummyHtml);
  });

  it('Should return empty string if no html provided', () => {
    expect(htmlParser()).toEqual('');
  });
});
