import React, { useEffect, useState } from 'react';
import { getDwkBalance, reverseDwk, formatStakeInfo } from '../utils/fund';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getGroupsAndStakeInfo, Group } from '../utils/dao';
import { getAddr, sendMessage } from '../utils/message';
import { LANGS } from '../constants/env';

import { useVoerkaI18n } from '@voerkai18n/react';
import { DaoData } from '../components/Dao';

import { FormControl, InputLabel, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Modal } from 'antd';
import { checkWallet } from '../utils/wallet';
import StyledTextField from '../components/Common';

import { parseNumber } from '../utils/component';
import { useParams } from 'react-router-dom';
import { GroupOptions } from '../components/GroupOptions';

const Stake = () => {
  let { groupId, daoLang = '' } = useParams();
  let parseResult: boolean[] = [];
  let parseGroupId = parseNumber(groupId, parseResult);

  const { t } = useVoerkaI18n();
  const [balance, setBalance] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [address, setAddress] = useState('');

  const [group, setGroup] = useState(parseGroupId.toString());
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [response, setResponse] = useState(null);
  const [language, setLanguage] = useState(daoLang);
  const [quantity, setQuantity] = useState('0');

  const handleLanguage = (event: SelectChangeEvent<string>) => {
    setLanguage(event.target.value);
  };

  const handleStakeOrWithdraw = async (confirmStr: string, action: string, resultAction: string) => {
    if (!checkWallet()) {
      return;
    }
    let data = {
      group: parseInt(group),
      lang: language,
      quantity: reverseDwk(quantity),
    };
    if (window.confirm(`${t('data is')}:\n${JSON.stringify(data, null, 2)}\n\n${confirmStr}?`)) {
      setLoading(true);
      let Messages = await sendMessage(action, data, resultAction);
      setResponse(JSON.parse(Messages[0].Data));
      setVisible(true);
    }
  };

  const handleStake = async () => {
    handleStakeOrWithdraw(t('Are you sure to stake'), 'Stake', 'Staked');
  };

  const handleWithdraw = async () => {
    handleStakeOrWithdraw(t('Are you sure to withdraw'), 'Unstake', 'Unstaked');
  };

  async function fetchData() {
    const address = await getAddr();
    setAddress(address);

    const bal = await getDwkBalance();
    setBalance(bal);

    const feGroups = await getGroupsAndStakeInfo(address);
    setGroups(feGroups);
  }

  const handleOk = () => {
    setVisible(false);
    setLoading(false);
    fetchData();
  };

  const handleQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  useEffect(() => {
    checkWallet();
    fetchData();
  }, []);

  const handleGroup = (event: SelectChangeEvent<string>) => {
    setGroup(event.target.value);
  };

  let selectedDao = '';
  if (parseGroupId !== 0 && daoLang !== '') {
    selectedDao = `${parseGroupId}-${daoLang}`;
  }

  const languageOptions = (
    <FormControl sx={{ width: '25ch', marginRight: '20px', marginBottom: '20px' }}>
      <InputLabel id="demo-simple-select-label">{t('Language') + '*'}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={language}
        label="Language"
        onChange={handleLanguage}
        error={language === ''}
      >
        {LANGS.map((lang: any) => (
          <MenuItem value={lang} key={lang}>
            {lang}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto p-4">
        <div className="w-full sm:w-1/2 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4 mb-6">
          <div className="flex-1 z-0 overflow-hidden">
            <h2 className="text-xl font-medium text-black capitalize">{t('balance')}</h2>
            <details open className="mt-4 text-gray-700" key="dashboard-balance">
              <summary className="font-semibold bg-gray-200 rounded-md px-3 py-1">DWK</summary>
              <span className="ml-6 text-sm">{balance}</span>
            </details>
          </div>
        </div>

        <div className="flex flex-wrap">
          <DaoData title={t('DAO data')} groups={groups} selectedDao={selectedDao} />
          <DaoData title={t('my stakes')} groups={groups} selectedDao={selectedDao} stakerId={address} />
        </div>

        <h1 className="text-start font-bold text-3xl mt-10 mb-5 capitalize">{t('stake or withdraw')}</h1>
        <GroupOptions group={group} handleGroup={handleGroup} groups={groups} />
        {languageOptions}

        <form noValidate autoComplete="off" className="mt-5">
          <StyledTextField
            label={t('DWK Quantity') + '*'}
            variant="outlined"
            id="custom-css-outlined-input"
            sx={{ width: '17ch' }}
            value={quantity}
            onChange={handleQuantity}
          />
          <span> = {reverseDwk(quantity)} wei</span>
        </form>

        <div className="flex justify-center">
          <button
            className="px-4 py-2 text-white bg-gradient-to-r from-violet-400 to-indigo-color mt-4 mb-2 mr-4"
            onClick={handleStake}
            disabled={loading}
          >
            {loading ? `${t('Processing')}...` : `${t('Stake')}`}
          </button>
          <button
            className="px-4 py-2 text-white bg-gradient-to-r from-violet-400 to-indigo-color mt-4 mb-2"
            onClick={handleWithdraw}
            disabled={loading}
          >
            {loading ? `${t('Processing')}...` : `${t('Withdraw')}`}
          </button>
        </div>
        <Modal title="Stake Success" open={visible} onOk={handleOk} onCancel={handleOk}>
          {response && <div className="text-left text-sm whitespace-pre-wrap">{formatStakeInfo(response)}</div>}
        </Modal>
      </div>
      <Footer />
    </>
  );
};

export default Stake;
