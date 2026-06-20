export const sortByPinyin = <T extends { namePinyin: string }>(data: T[]): T[] => {
  return [...data].sort((a, b) => 
    a.namePinyin.localeCompare(b.namePinyin, 'zh-CN')
  );
};
