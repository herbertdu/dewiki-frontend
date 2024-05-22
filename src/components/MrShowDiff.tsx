import React, { FC, useState, useEffect } from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import { MrData, getOldAndNewContent } from '../utils/article';
import { CHAR_LANGS } from '../constants/env';
import { useVoerkaI18n } from '@voerkai18n/react';

interface MrShowDiffProps {
  mrId: number;
  mrs: MrData[];
}

export const MrShowDiff: FC<MrShowDiffProps> = ({ mrId, mrs }) => {
  let { oldContent, newContent } = getOldAndNewContent(mrId, mrs);
  return <ShowDiff oldContent={oldContent} newContent={newContent} />;
};

interface ShowDiffProps {
  oldContent: string;
  newContent: string;
}

export const ShowDiff: FC<ShowDiffProps> = ({ oldContent, newContent }) => {
  const { activeLanguage } = useVoerkaI18n();
  let compareMethod = DiffMethod.WORDS;
  if (CHAR_LANGS.includes(activeLanguage || 'en')) {
    compareMethod = DiffMethod.CHARS;
  }
  return <ReactDiffViewer oldValue={oldContent} newValue={newContent} splitView={true} compareMethod={compareMethod} />;
};
