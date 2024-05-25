import React from 'react';
import { FormControl, InputLabel, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useVoerkaI18n } from '@voerkai18n/react';
import { Category } from '../utils/category';

interface CategoryIndex {
  categoryId: number;
  father: number;
  categoryName: string;
}

interface CategoryOptionsProps {
  category: string;
  handleChange: (event: SelectChangeEvent<string>) => void;
  categories: Category[];
  language: string;
}

export const CategoryOptions: React.FC<CategoryOptionsProps> = ({ category, handleChange, categories, language }) => {
  const { t } = useVoerkaI18n();

  let categoryIndex: CategoryIndex[] = categories.map((category: any, index) => {
    let categoryId = index + 1;
    let categoryName = category.names[language];
    let father = category.father;
    return { categoryId, father, categoryName };
  });

  function getLevel(categoryId: number, categories: CategoryIndex[]): number {
    let level = 0;
    let current = categories.find((category) => category.categoryId === categoryId);
    while (current && current.father !== 0) {
      level++;
      current = categories.find((category) => category.categoryId === current?.father);
    }
    return level;
  }

  function getIndentedName(category: CategoryIndex, categories: CategoryIndex[]): string {
    const level = getLevel(category.categoryId, categories);
    const indent = '---'.repeat(level);
    return `${category.categoryId} ${indent}${category.categoryName}`;
  }

  function sortCategories(categories: CategoryIndex[]): CategoryIndex[] {
    const sortedCategories: CategoryIndex[] = [];
    const addChildren = (fatherId: number) => {
      categories
        .filter((category) => category.father === fatherId)
        .forEach((category) => {
          sortedCategories.push(category);
          addChildren(category.categoryId);
        });
    };
    addChildren(0);
    return sortedCategories;
  }
  const sortedCategories = sortCategories(categoryIndex);

  return (
    <FormControl sx={{ width: '25ch', marginRight: '20px', marginBottom: '20px' }}>
      <InputLabel id="demo-simple-select-label">{t('Category')}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={category}
        label="Category"
        onChange={handleChange}
      >
        {sortedCategories.map((category) => (
          <MenuItem value={category.categoryId} key={category.categoryId}>
            {getIndentedName(category, sortedCategories)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategoryOptions;
