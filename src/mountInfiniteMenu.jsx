import React from 'react';
import { createRoot } from 'react-dom/client';
import InfiniteMenu from './InfiniteMenu.jsx';

let rootInstance = null;

export function mountInfiniteMenu(containerId, items, onItemClick) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!rootInstance) {
    rootInstance = createRoot(container);
  }

  rootInstance.render(
    <InfiniteMenu
      items={items}
      scale={1.0}
      backgroundColor="transparent"
      onItemClick={onItemClick}
    />
  );
}
