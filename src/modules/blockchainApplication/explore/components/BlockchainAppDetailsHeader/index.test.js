import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import BlockchainAppDetailsHeader from '.';

const appName = 'Enevti';
const appAddress = 'evtguo9kqnea2zsfo3a6qppozsxsg92nuuma3p7ad';
const appUrl = 'https://enevti.com';

const application = {
  data: {
    name: appName,
    projectPage: appUrl,
    icon: '',
    bg: '',
  },
};
const mockChainAction = jest.fn();

describe('BlockchainAppDetailsHeader', () => {
  it('displays properly after loading', () => {
    render(
      <BlockchainAppDetailsHeader
        application={application}
        chainAction={
          <div onClick={mockChainAction}>
            <img src="" />
          </div>
        }
        loading={false}
        clipboardCopyItems={[{ value: appAddress }]}
      />
    );
    expect(screen.getByText(appName)).toBeInTheDocument();
    expect(
      screen.getByText(appAddress?.replace(/^(.{6})(.+)?(.{4})$/, '$1...$3'))
    ).toBeInTheDocument();
    expect(screen.getByText(appUrl)).toBeInTheDocument();
  });

  it('displays loading screen during loading', () => {
    render(
      <BlockchainAppDetailsHeader
        application={application}
        chainAction={
          <div onClick={mockChainAction}>
            <img src="" />
          </div>
        }
        loading
      />
    );
    expect(screen.getAllByTestId('skeleton-wrapper')).toHaveLength(3);
  });

  it('should show header and label text', () => {
    const headerText = 'Header text';
    const labelText = 'label text:';

    render(
      <BlockchainAppDetailsHeader
        headerText={headerText}
        application={application}
        clipboardCopyItems={[{ label: labelText, value: 'value' }]}
      />
    );
    expect(screen.getByText(headerText)).toBeTruthy();
    expect(screen.getByText(labelText)).toBeTruthy();
  });

  it('should use a fallback image if image fails to load', () => {
    render(<BlockchainAppDetailsHeader application={application} />);
    const image = screen.getByAltText('logo');
    fireEvent.error(image);
    const imgSrc = image.getAttribute("src");
    expect(typeof imgSrc).toBe("string")
  });
});
