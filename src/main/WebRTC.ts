// 禁用WebRTC相关功能

Reflect.set(navigator, 'getUserMedia', undefined);
Reflect.set(self, 'MediaStreamTrack', undefined);
Reflect.set(self, 'RTCPeerConnection', undefined);
Reflect.set(self, 'RTCSessionDescription', undefined);