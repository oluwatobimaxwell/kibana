import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiTitle,
  EuiFlyoutFooter,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButtonEmpty,
} from '@elastic/eui';
import SingleDocumentView from './SingleDocumentView';

type Props = {};

const ViewEnrichedData = forwardRef(({ }: Props, ref) => {
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  const [data, setData] = useState<any>();

  //   use imperative handle to expose the openFlyout method
  useImperativeHandle(ref, () => ({
    open: (record: any) => {
      setIsFlyoutVisible(true);
      setData(record);
    },
    close: () => {
        setIsFlyoutVisible(false);
        setData(undefined);
    },
  }));

  const closeFlyout = () => setIsFlyoutVisible(false);


  if (!isFlyoutVisible) return <div />;
  return (
    <EuiFlyout onClose={closeFlyout} aria-labelledby="flyoutComplicatedTitle">
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="m">
          <h3 style={{ fontSize: '1.5rem' }}>
            Expanded Document
          </h3>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <SingleDocumentView data={data} />
      </EuiFlyoutBody>
      <EuiFlyoutFooter>
          <EuiFlexGroup justifyContent="spaceBetween">
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty
                iconType="cross"
                onClick={closeFlyout}
                flush="left"
              >
                Close
              </EuiButtonEmpty>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlyoutFooter>
    </EuiFlyout>
  );
});

export default ViewEnrichedData;
