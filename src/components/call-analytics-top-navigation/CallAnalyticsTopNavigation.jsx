// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { TbUserCircle } from 'react-icons/tb';

import useAppContext from '../../contexts/app';

const CallAnalyticsTopNavigation = () => {
  const { user } = useAppContext();
  const userId = user?.attributes?.['custom:email_alias'] ||
    user?.attributes?.email ||
    (user?.username?.includes('_') ? user.username.split('_').slice(1).join('_') : user?.username) ||
    'user';

  return (
    <div
      id="top-navigation"
      style={{
        background: '#0d1321',
        padding: '0 24px',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1002,
      }}
    >
      <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em' }}>
        Live Call Analytics with Agent Assist
      </span>
      <span style={{ color: '#cbd5e1', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <TbUserCircle style={{ fontSize: '15px' }} />
        {userId}
        <span style={{ fontSize: '10px' }}>▼</span>
      </span>
    </div>
  );
};

export default CallAnalyticsTopNavigation;
