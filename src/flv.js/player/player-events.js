/*
 * Copyright (C) 2016 Bilibili. All Rights Reserved.
 *
 * @author zheng qian <xqq@xqq.im>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const PlayerEvents = {
    ERROR: 'error',
    CREATE_LOADER: 'create_loader',
    LOADING_STARTED: 'loading_started',
    LOADING_COMPLETE: 'loading_complete',
    RECOVERED_EARLY_EOF: 'recovered_early_eof',
    MEDIA_INFO: 'media_info',
    STATISTICS_INFO: 'statistics_info',
    HTTP_REQUEST_ENDED: 'http_request_ended',
    P2P_REQUEST_ENDED: 'p2p_request_ended',
    HTTP_HEADER_RECEIVED: 'http_header_received',
    AUDIO_FRAME_DECODED: 'audio_frame_decoded',
    VIDEO_FRAME_DECODED: 'video_frame_decoded',
    CTS_WARNING: 'cts_warning',
    FLV_DATA_ABNORMAL: 'flv_data_abnormal',
};

/**
 * @desc Internal. Delivery arbitrary events to player.
 */
export const OTHER_EVENTS_POLYMER = 'other_events_polymer';

export default PlayerEvents;
