import { EuiButton } from '@elastic/eui';
import React, { FC, useMemo } from 'react';
import { LooseObject } from '../types';

type Props = {
  data?: LooseObject;
  value: any;
  type: string;
};

const Image = ({ value }: { value: any }) => {
  const resource = value?.includes('http') ? value : `data:image/jpeg;base64,${value}`;
  if (!value) return null;
  return (
    <a href={resource} target="_blank" rel="noreferrer">
      <img className="table-image" src={resource} alt="No image" />
    </a>
  );
};

const Audio = ({ value = '' }) => {
    const resource = value?.includes('http') ? value : `data:image/jpeg;base64,${value}`;
  return (
    <audio controls>
      <source src={resource} type="audio/ogg" />
      <source src={resource} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

const Video = ({ value = '' }) => {
  const resource = value?.includes('http') ? value : `data:image/jpeg;base64,${value}`;
  return (
    <EuiButton
      iconType="videoPlayer"
      iconSide="left"
      onClick={() => window.open(resource, '_blank')}
      title="Play video"
    >
      Play video
    </EuiButton>
  );
};

const OpenLink = ({ value = '' }) => {
  return (
    <EuiButton
      iconType="link"
      iconSide="left"
      onClick={() => window.open(value, '_blank')}
      title="Play video"
    >
      Open File
    </EuiButton>
  );
};

const CustomDisplay: FC<Props> = ({ type, value, data }) => {
  const content = useMemo(() => {
    if (type === 'image') {
      return <Image value={String(value)} />;
    }
    if (type === 'audio') {
      return <Audio value={String(value)} />;
    }
    if (type === 'video') {
      return <Video value={String(value)} />;
    }
    return <OpenLink value={String(value)} />;
  }, [type, value, data]);
  return <div>{content}</div>;
};

export default CustomDisplay;
