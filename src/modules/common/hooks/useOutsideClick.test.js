import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useOutsideClick } from './useOutsideClick';
import { fireEvent } from '@testing-library/dom';

describe('useOutsideClick hook', () => {

  it('sorts list by the default sort order', async () => {
    const callback = jest.fn();

    const documentWrapper = ({ children }) => <div><div>outside</div> {children}</div>
    const elem = document.createElement('div');
    const ref = { current: elem };
    renderHook(
      () => useOutsideClick(ref, callback), { wrapper: documentWrapper }
    );
    expect(callback).not.toHaveBeenCalled();

  });

  it('calls the callback when user clicks outside', async () => {
    const callback = jest.fn();
    const div = document.createElement("div")
    document.body.append(div)
    const elem = document.createElement('div');
    const ref = { current: elem };
    renderHook(
      () => useOutsideClick(ref, callback)
    );
    fireEvent.mouseDown(document.getElementsByTagName('div')[0])

    expect(callback).toHaveBeenCalled();
  })

});
