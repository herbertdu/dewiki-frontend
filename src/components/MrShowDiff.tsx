import React, { FC, useState, useEffect } from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import { MrData, getOldAndNewContent } from '../utils/article';

interface MrShowDiffProps {
  mrId: number;
  mrs: MrData[];
}

export const MrShowDiff: FC<MrShowDiffProps> = ({mrId, mrs}) => {
  let { oldContent, newContent } = getOldAndNewContent(mrId, mrs);
  return (
    <ReactDiffViewer oldValue={oldContent} newValue={newContent} splitView={true} compareMethod={DiffMethod.WORDS} />
  );
};
