import { useVoerkaI18n } from '@voerkai18n/react';
import React, { FC, createRef, useEffect } from 'react';
import Vditor from 'vditor';
import { LANG_REGION_MAP } from '../constants/env';
import 'vditor/dist/index.css';

export interface IVditorEditorProps {
  keyID: string;
  options?: IOptions;
  bindVditor?(vditor: Vditor): void;
  initialValue?: string;
}

const Editor: FC<IVditorEditorProps> = ({ keyID, options, bindVditor, initialValue = '' }) => {
  const vditorRef = createRef<HTMLDivElement>();
  const { activeLanguage } = useVoerkaI18n();

  useEffect(() => {
    let vditorLang: keyof II18n = LANG_REGION_MAP[
      (activeLanguage as keyof typeof LANG_REGION_MAP) || 'en'
    ] as keyof II18n;
    const vditor = new Vditor(keyID, {
      after: () => {
        vditor.setValue(initialValue);
        if (!!bindVditor) {
          bindVditor(vditor);
        }
      },
      outline: { enable: true, position: 'left' },
      lang: vditorLang,
      counter: { enable: true },
      toolbarConfig: {
        hide: false,
        pin: true,
      },
      preview: {
        actions: ['desktop', 'tablet', 'mobile'],
      },
      height: '95vh',
      typewriterMode: true,
    });
  }, [activeLanguage]);

  return <div id={keyID} ref={vditorRef}></div>;
};

export default Editor;
