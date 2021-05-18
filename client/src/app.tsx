import React from 'react';

import { MenuHeader } from '@/components/GlobalSider';

export const layout = {
  menuHeaderRender: (logoDom: any, titleDom: any) => <MenuHeader logoDom={logoDom} titleDom={titleDom} />,
  logout: () => <h1>11111111</h1>,
};


export async function getInitialState() {
  const data = {};
  return data;
}
