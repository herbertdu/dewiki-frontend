import { useEffect, useState } from 'react';
import { getDwkBalance, reverseDwk, formatStakeInfo } from '../utils/fund';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getGroupsAndStakeInfo, Staker, Dao, Group } from '../utils/dao';
import { getAddr, sendMessage } from '../utils/message';
import { LANGS } from '../constants/env';

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { useVoerkaI18n } from '@voerkai18n/react';
import { GroupDetails } from '../components/Dao';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Modal } from 'antd';
import { checkWallet } from '../utils/wallet';
import StyledTextField from '../components/Common';

const Stake = () => {
  const { t } = useVoerkaI18n();
  const [balance, setBalance] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [address, setAddress] = useState('');
  const [expandedItemIds, setExpandedItemIds] = useState<string[]>([]);

  const [group, setGroup] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [response, setResponse] = useState(null);
  const [language, setLanguage] = useState('');
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

    let expanded = Array.from({ length: feGroups.length }, (_, i) => (i + 1).toString());
    setExpandedItemIds(expanded);
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

  const groupOptions = (
    <FormControl sx={{ width: '25ch', marginRight: '20px', marginBottom: '20px' }}>
      <InputLabel id="demo-simple-select-label">{t('group') + '*'}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={group}
        label="group"
        onChange={handleGroup}
        error={group === ''}
      >
        {groups.map((group: any) => (
          <MenuItem value={group.info.groupId.toString()} key={group.info.name}>
            {`${group.info.groupId} - ${group.info.name}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

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
      <div>DWK: {balance}</div>
      <h1 className="text-start font-bold text-3xl mt-10 mb-5 md:first-letter:uppercase">{t('staked details')}:</h1>
      {groups.length > 0 && (
        <SimpleTreeView defaultExpandedItems={expandedItemIds}>
          {groups
            .filter((group) => group.info.father === 0)
            .map((group, index) => (
              <GroupDetails key={index} group={group} groups={groups} stakerId={address} />
            ))}
        </SimpleTreeView>
      )}

      <h1 className="text-start font-bold text-3xl mt-10 mb-5 md:first-letter:uppercase">{t('stake or withdraw')}</h1>
      {groupOptions}
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
      <Footer />
    </>
  );
};

export default Stake;
