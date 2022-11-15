import React, { useMemo } from 'react';
import { EuiBasicTable } from '@elastic/eui';
import { LooseObject } from '../types';

type Props = {
  data: LooseObject;
};

const SingleDocumentView: React.FC<Props> = ({ data }) => {

  const entries = useMemo<{ id: string; key: string; value: any; }[]>(() => {
    return Object.entries(data)
      .filter(([key]) => key !== 'result_text' && typeof data[key] !== 'object' && key !== 'column_names')
      .map(([key, value], id) => {
          const imageFields = [
            'nimc_photo',
            'tc_photo',
            'tc_image',
            'image',
            'twitter_profile_image_url',
          ];
          if (imageFields.includes(key)) {
            return {
              id: `${id}`,
              key,
              value: (
                <img
                  style={{ maxHeight: 200, borderRadius: 10 }}
                  src={value?.includes('http') ? value : `data:image/jpeg;base64,${value}`}
                  alt="Photo"
                />
              ),
            };
          }
          if (typeof value === 'boolean') {
            return {
              id: `${id}`,
              key,
              value: value ? 'TRUE' : 'FALSE',
            };
          }
          return { id: `${id}`, key, value };
      });
  }, [data]);

  return (
    <div className="single-view">
      <EuiBasicTable
        items={entries}
        itemId="id"
        columns={[
          {
            field: 'key',
            name: 'Field'
          },
          {
            field: 'value',
            name: 'Value',
            render: (value: string, item: any) => <span className="field-item-value">{value}</span>,
          },
        ]}
        responsive
        style={{
          backgroundColor: 'transparent',
          width: '100%',
        }}
      />
    </div>
  );
};

export default SingleDocumentView;
