// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { TbHistory } from 'react-icons/tb';

const NavTabs = ({ activeTab, setActiveTab }) => (
  <div className="nav-tabs-container">
    <button
      type="button"
      className={`nav-tab-btn ${activeTab === 'live' ? 'nav-tab-btn--active' : ''}`}
      onClick={() => setActiveTab('live')}
    >
      <span className="live-dot" />
      <span style={{ color: '#ffffff' }}>Live call</span>
    </button>
    <button
      type="button"
      className={`nav-tab-btn ${activeTab === 'history' ? 'nav-tab-btn--active' : ''}`}
      onClick={() => setActiveTab('history')}
    >
      <TbHistory style={{ fontSize: '14px', color: '#ffffff' }} />
      <span style={{ color: '#ffffff' }}>Call history</span>
    </button>
  </div>
);

export default NavTabs;
