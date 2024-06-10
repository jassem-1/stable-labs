import React from 'react';

type Props = {
  selectedTab: string;
  onSelectTab: (tab: string) => void;
};

const TokenTabs: React.FC<Props> = ({ selectedTab, onSelectTab }) => {
  return (
    <div className="tabs">
      <button
        className={`tab ${selectedTab === 'ERC-20' ? 'active' : ''}`}
        onClick={() => onSelectTab('ERC-20')}
      >
        ERC-20
      </button>
      <button
        className={`tab ${selectedTab === 'ERC-721' ? 'active' : ''}`}
        onClick={() => onSelectTab('ERC-721')}
      >
        ERC-721
      </button>
      <button
        className={`tab ${selectedTab === 'ERC-1155' ? 'active' : ''}`}
        onClick={() => onSelectTab('ERC-1155')}
      >
        ERC-1155
      </button>
      <style jsx>{`
        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .tab {
          padding: 10px 20px;
          background: #f0f0f0;
          border: none;
          cursor: pointer;
        }
        .tab.active {
          background: #0070f3;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default TokenTabs;
