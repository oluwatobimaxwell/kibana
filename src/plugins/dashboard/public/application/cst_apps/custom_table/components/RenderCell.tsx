import React, { FC } from 'react';
import CustomDisplay from '../../magnet_data/components/CustomDisplay';

const RenderCell: FC<{
  value: any;
  type: string;
}> = ({ value, type }) => {
  if (type && type !== 'string') {
    return <CustomDisplay type={type} value={value} />;
  }
  return <div>{value || '(missing value)'}</div>;
};

export default RenderCell;
