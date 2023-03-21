import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import MenuSelect, { MenuItem } from '.';

const mockMenuItems = [
  {
    value: 1,
    child: 'menu-item-1',
  },
  {
    value: 2,
    child: 'menu-item-2',
  },
];

describe('MenuSelect', () => {
  const props = {
    value: 2,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    render(<MenuSelect {...props}>
      {mockMenuItems.map(({ value, child }) => (
        <MenuItem value={value} key={value}>
          {child}
        </MenuItem>
      ))}
    </MenuSelect>);
  });

  it('should not display options on mount', () => {
    expect(screen.getByTestId('dropdown-popup').classList).not.toContain('show');
  });

  it('should popup options', () => {
    fireEvent.click(screen.getByAltText('dropdownFieldIcon'));

    expect(screen.getByTestId('dropdown-popup').classList).toContain('show');
  });

  it('should render the currently selected option', () => {
    const selectedMenuItem = screen.getByTestId('selected-menu-item');

    expect(selectedMenuItem.firstChild.textContent).toBe('menu-item-2');
  });

  it('should trigger the onChange callback ', () => {
    fireEvent.click(screen.getByAltText('dropdownFieldIcon'));
    fireEvent.click(screen.getByText('menu-item-1'));

    expect(props.onChange).toHaveBeenCalledWith(1);
  });

  it('should dismiss the popup option', () => {
    fireEvent.click(screen.getByAltText('dropdownFieldIcon'));
    fireEvent.keyUp(window, { key: 'Escape', code: 'Escape', charCode: 27 });
    expect(screen.getByTestId('dropdown-popup').classList).not.toContain('show');
  });

  it('should dismiss popup', () => {
    fireEvent.click(screen.getByAltText('dropdownFieldIcon'));
    fireEvent.click(screen.getByTestId('overlay'));
    expect(screen.getByTestId('dropdown-popup').classList).not.toContain('show');
  });
});
