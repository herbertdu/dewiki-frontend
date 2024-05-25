import React from 'react';
import { FormControl, InputLabel, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useVoerkaI18n } from '@voerkai18n/react';
import { Group } from '../utils/dao';

interface GroupOptionProps {
  group: string;
  handleGroup: (event: SelectChangeEvent<string>) => void;
  groups: Group[];
}

export const GroupOptions: React.FC<GroupOptionProps> = ({ group, handleGroup, groups }) => {
  const { t } = useVoerkaI18n();

  const map: { [key: number]: any[] } = {};
  for (let group of groups) {
    if (!map[group.info.father]) {
      map[group.info.father] = [];
    }
    map[group.info.father].push(group);
  }

  function createTree(father = 0, prefix = '') {
    let tree: any[] = [];
    if (map[father]) {
      for (let group of map[father]) {
        tree.push({
          ...group,
          info: {
            ...group.info,
            name: prefix + group.info.name,
          },
        });
        tree = tree.concat(createTree(group.info.groupId, prefix + '---'));
      }
    }
    return tree;
  }

  const treeGroups = createTree();

  return (
    <FormControl sx={{ width: '25ch', marginRight: '20px', marginBottom: '20px' }}>
      <InputLabel id="demo-simple-select-label" className='capitalize'>{t('DAO group') + '*'}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={group}
        label="group"
        onChange={handleGroup}
        error={group === ''}
      >
        {treeGroups.map((group: any) => (
          <MenuItem value={group.info.groupId.toString()} key={group.info.name} disabled={!group.info.isLeaf}>
            {`${group.info.groupId} ${group.info.name}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GroupOptions;
