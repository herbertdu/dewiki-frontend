import { useEffect, useState } from 'react';
import { getDwkBalance, formatDwk, reverseDwk, formatLockDetail, formatStakeInfo } from '../utils/fund';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getGroups, Staker, Dao, Group } from '../utils/dao';
import { getAddr, sendMessage } from '../utils/message';

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useVoerkaI18n } from '@voerkai18n/react';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Modal } from 'antd';
import { checkWallet } from '../utils/wallet';
import StyledTextField from '../components/Common';

const StakerDetails = ({ staker, stakerId }: { staker: Staker; stakerId: string }) => (
    <TreeItem itemId={Math.random().toString()} label={`Staker: ${stakerId}`}>
        <TreeItem itemId={Math.random().toString()} label={`Unlock Amount: ${formatDwk(staker.unlockAmount)}`} />
        <TreeItem itemId={Math.random().toString()} label={`Unfrozen: ${formatDwk(staker.unfrozen)}`} />
        <TreeItem itemId={Math.random().toString()} label={`Lock Amount: ${formatDwk(staker.lockAmount)}`} />
        <TreeItem itemId={Math.random().toString()} label={`Lock Detail: ${formatLockDetail(staker.lockDetail)}`} />
    </TreeItem>
);

const DaoDetails = ({ daoId, dao, stakerId }: { daoId: string; dao: Dao; stakerId: string }) => {
    if (!dao.stakers[stakerId]) {
        return <></>;
    }
    return (
        <TreeItem itemId={Math.random().toString()} label={daoId}>
            <StakerDetails staker={dao.stakers[stakerId]} stakerId={stakerId} />
        </TreeItem>
    );
};

const GroupDetails = ({ group, groups, stakerId }: { group: Group; groups: Group[]; stakerId: string }) => {
    return (
        <TreeItem itemId={group.info.groupId.toString()} label={`Group: ${group.info.name}`}>
            {Object.entries(group.daos).map(([daoId, dao]) => (
                <DaoDetails key={daoId} daoId={daoId} dao={dao} stakerId={stakerId} />
            ))}
            {groups
                .filter((g) => g.info.father === group.info.groupId)
                .map((childGroup) => (
                    <GroupDetails key={childGroup.info.name} group={childGroup} groups={groups} stakerId={stakerId} />
                ))}
        </TreeItem>
    );
};

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
            console.log(data);
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
        handleStakeOrWithdraw(t('Are you sure to withdraw'), 'Unstake', 'Unstaked')
    };

    async function fetchData() {
        const bal = await getDwkBalance();
        setBalance(bal);

        const feGroups = await getGroups();
        setGroups(feGroups);

        let expanded = Array.from({ length: feGroups.length }, (_, i) => (i + 1).toString());
        setExpandedItemIds(expanded);

        const address = await getAddr();
        setAddress(address);
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

    let languagesIndex: string[] = [];
    if (group !== '') {
        languagesIndex = Object.keys(groups[parseInt(group) - 1].daos);
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
                {languagesIndex.map((lang: any) => (
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
            <h1 className="text-start font-bold text-3xl mt-10 mb-5 md:first-letter:uppercase">
                {t('staked details')}:
            </h1>
            {groups.length > 0 && (
                <SimpleTreeView defaultExpandedItems={expandedItemIds}>
                    {groups
                        .filter((group) => group.info.father === 0)
                        .map((group, index) => (
                            <GroupDetails key={index} group={group} groups={groups} stakerId={address} />
                        ))}
                </SimpleTreeView>
            )}

            <h1 className="text-start font-bold text-3xl mt-10 mb-5 md:first-letter:uppercase">
                {t('stake or withdraw')}
            </h1>
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
