// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

const NavTabs = ({ activeTab, setActiveTab }) => (
  <div className="nav-tabs-container">
    <button
      type="button"
      className={`nav-tab-btn ${activeTab === 'live' ? 'nav-tab-btn--active' : ''}`}
      onClick={() => setActiveTab('live')}
    >
      <span className="live-dot" />
      Live Call
    </button>
    <button
      type="button"
      className={`nav-tab-btn ${activeTab === 'history' ? 'nav-tab-btn--active' : ''}`}
      onClick={() => setActiveTab('history')}
    >
      Call History
    </button>
  </div>
);

export default NavTabs;
