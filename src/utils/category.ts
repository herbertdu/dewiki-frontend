import { dryrun } from '@permaweb/aoconnect';
import { DEWIKI_PROCESS } from '../constants/env';
import { isContainAction } from './message';


export interface Category {
  names: any;
  father: number;
  introduceArticle: number;
  articles: any;
  categoryId: number;
}

function formatCategories(categories: any[]): any[] {
  let newGroups = categories.map((category: any, index: any) => ({
    ...category,
    categoryId: index + 1,
  }));
  return newGroups;
}

export async function getCategories(): Promise<Category[]> {
  const { Messages, Error } = await dryrun({
    process: DEWIKI_PROCESS,
    tags: [{ name: 'Action', value: 'GetCategories' }],
  });
  let categories = [];
  if (isContainAction(Messages, 'ReceiveCategories')) {
    categories = JSON.parse(Messages[0].Data);
    categories = formatCategories(categories);
  } else {
    alert('Error: ' + Error);
  }
  return categories;
}
