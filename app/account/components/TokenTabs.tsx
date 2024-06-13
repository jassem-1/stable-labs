import React from 'react';

type Props = {
  selectedTab: string;
  onSelectTab: (tab: string) => void;
};

const TokenTabs: React.FC<Props> = ({ selectedTab, onSelectTab }) => {
  return (
    <div className=" text-white  rounded-lg bg-transparent p-3">
      <button
        className={`tab   ${selectedTab === 'ERC-20' ? 'active' : ''}`}
        onClick={() => onSelectTab('ERC-20')}
      >
        ERC-20
      </button>
      <button
        className={`tab    ${selectedTab === 'ERC-721' ? 'active' : ''}`}
        onClick={() => onSelectTab('ERC-721')}
      >
        ERC-721
      </button>
      <button
        className={`tab    ${selectedTab === 'ERC-1155' ? 'active' : ''}`}
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
        border:none;
          cursor: pointer;
        }
        .tab.active {
          background: none;
          color: #0ff ;
          text-decoration: underline;
          
        }
      `}</style>
    </div>
  );
};

export default TokenTabs;
