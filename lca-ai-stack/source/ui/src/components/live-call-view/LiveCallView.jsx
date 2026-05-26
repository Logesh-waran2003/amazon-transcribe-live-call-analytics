// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useMemo, useState } from 'react';
import { Auth } from 'aws-amplify';
import { FiPhoneOff } from 'react-icons/fi';
import { Logger } from 'aws-amplify';

import useCallsContext from '../../contexts/calls';
import useSettingsContext from '../../contexts/settings';
import mapCallsAttributes from '../common/map-call-attributes';
import { IN_PROGRESS_STATUS } from '../common/get-recording-status';
import CallPanel from '../call-panel';

const logger = new Logger('LiveCallView');

const LiveCallView = () => {
  const {
    calls,
    callTranscriptPerCallId,
    sendGetTranscriptSegmentsRequest,
    setLiveTranscriptCallId,
    setToolsOpen,
  } = useCallsContext();
  const { settings } = useSettingsContext();

  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const resolveEmail = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const email =
          user?.attributes?.['custom:email_alias'] ||
          user?.attributes?.email ||
          (user?.username?.includes('_')
            ? user.username.split('_').slice(1).join('_')
            : user?.username) ||
          '';
        setUserEmail(email.toLowerCase());
      } catch (e) {
        logger.error('Failed to resolve user email', e);
      }
    };
    resolveEmail();
  }, []);

  const liveCall = useMemo(() => {
    if (!calls?.length || !userEmail) return null;
    const inProgressStates = ['STARTED', 'TRANSCRIBING'];
    const agentLiveCalls = calls.filter(
      (c) =>
        inProgressStates.includes(c.Status) &&
        c.AgentId?.toLowerCase().includes(userEmail),
    );
    if (!agentLiveCalls.length) return null;
    const mapped = mapCallsAttributes([agentLiveCalls[0]], settings);
    return mapped[0] || null;
  }, [calls, userEmail, settings]);

  useEffect(() => {
    if (!liveCall) {
      setLiveTranscriptCallId(null);
      return () => {};
    }
    const { callId } = liveCall;
    if (!callTranscriptPerCallId[callId]) {
      sendGetTranscriptSegmentsRequest(callId);
    }
    if (liveCall.recordingStatusLabel === IN_PROGRESS_STATUS) {
      setLiveTranscriptCallId(callId);
    }
    return () => {
      setLiveTranscriptCallId(null);
    };
  }, [liveCall?.callId]);

  if (!liveCall) {
    return (
      <div className="live-call-empty">
        <FiPhoneOff className="live-call-empty-icon" />
        <p className="live-call-empty-heading">No active call</p>
        <p className="live-call-empty-subtext">
          You don&apos;t have an active live call right now. Details will appear here
          automatically once a call begins.
        </p>
      </div>
    );
  }

  return (
    <CallPanel
      item={liveCall}
      setToolsOpen={setToolsOpen}
      callTranscriptPerCallId={callTranscriptPerCallId}
    />
  );
};

export default LiveCallView;
