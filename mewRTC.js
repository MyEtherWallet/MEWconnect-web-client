//=========================================================================
// based on https://github.com/feross/simple-peer
// by Feross Aboukhadijeh
// ported to es6 with modifications by Steven Mieskoski
//=========================================================================
"use strict";

var isNode = typeof global !== "undefined" && ({}).toString.call(global) === '[object global]';
if(isNode){
    var SStream = require("readable-stream");
    var EventEmitter3 = require("eventemitter3");
    var cryptoImpl = require("crypto");
} else {
    var SStream = SStream;
    var EventEmitter3 = EventEmitter3;
    var cryptoImpl = CCrypto.crypto;
}

class MewRTC {
    constructor(opts) {
        // default stun server
        let config = {
            iceServers: [
                {url: 'stun:global.stun.twilio.com:3478?transport=udp'}
            ]
        };

        let constraints = {};
        let channelConfig = {};

        this.emitter = new EventEmitter3();

        this.MAX_BUFFERED_AMOUNT = 64 * 1024;

        if (!(this instanceof MewRTC)) return new MewRTC(opts);

        this._id = this.randombytes(4).toString('hex').slice(0, 7);
        // console.log('new peer %o', opts);//todo dev item

        opts = Object.assign({
            allowHalfOpen: false
        }, opts);

        this.readableStream = SStream;
        this.readableStream.Duplex.call(this, opts);

        this.channelName = opts.initiator
            ? opts.channelName || this.randombytes(20).toString('hex')
            : null;

        // Needed by _transformConstraints, so set this early
        this._isChromium = typeof window !== 'undefined' && !!window.webkitRTCPeerConnection;

        this.initiator = opts.initiator || false;
        this.channelConfig = opts.channelConfig || channelConfig;
        this.config = opts.config || config;
        this.constraints = this._transformConstraints(opts.constraints || constraints);
        this.offerConstraints = this._transformConstraints(opts.offerConstraints || {});
        this.answerConstraints = this._transformConstraints(opts.answerConstraints || {});
        this.reconnectTimer = opts.reconnectTimer || false;
        this.sdpTransform = opts.sdpTransform || function (sdp) {
            return sdp
        };
        this.stream = opts.stream || false;
        this.trickle = opts.trickle !== undefined ? opts.trickle : true;

        this.destroyed = false;
        this.connected = false;

        this.remoteAddress = undefined;
        this.remoteFamily = undefined;
        this.remotePort = undefined;
        this.localAddress = undefined;
        this.localPort = undefined;

        this._wrtc = (opts.wrtc && typeof opts.wrtc === 'object')
            ? opts.wrtc
            : this.getBrowserRTC();

        if (!this._wrtc) {
            if (typeof window === 'undefined') {
                throw new Error('No WebRTC support: Specify `opts.wrtc` option in this environment')
            } else {
                throw new Error('No WebRTC support: Not a supported browser')
            }
        }

        this._pcReady = false;
        this._channelReady = false;
        this._iceComplete = false; // ice candidate trickle done (got null candidate)
        this._channel = null;
        this._pendingCandidates = [];
        this._previousStreams = [];

        this._chunk = null;
        this._cb = null;
        this._interval = null;
        this._reconnectTimeout = null;

        this._pc = new (this._wrtc.RTCPeerConnection)(this.config, this.constraints);

        // We prefer feature detection whenever possible, but sometimes that's not
        // possible for certain implementations.
        this._isWrtc = Array.isArray(this._pc.RTCIceConnectionStates);
        this._isReactNativeWebrtc = typeof this._pc._peerConnectionId === 'number';

        this._pc.oniceconnectionstatechange = () => {
            this._onIceStateChange()
        };
        this._pc.onicegatheringstatechange = () => {
            this._onIceStateChange()
        };
        this._pc.onsignalingstatechange = () => {
            this._onSignalingStateChange()
        };
        this._pc.onicecandidate = (event) => {
            this._onIceCandidate(event)
        };

        this._pc.onicecandidateerror = (event) => {
            // console.log(event);//todo remove dev item
        };

        // Other spec events, unused by this implementation:
        // - onconnectionstatechange
        // - onicecandidateerror
        // - onfingerprintfailure

        if (this.initiator) {
            var createdOffer = false;
            this._pc.onnegotiationneeded = () => {
                if (!createdOffer) this._createOffer();
                createdOffer = true
            };

            this._setupData({
                channel: this._pc.createDataChannel(this.channelName, this.channelConfig)
            })
        } else {
            this._pc.ondatachannel = (event) => {
                this._setupData(event)
            }
        }

        if ('addTrack' in this._pc) {
            // WebRTC Spec, Firefox
            if (this.stream) {
                this.stream.getTracks().forEach((track) => {
                    this._pc.addTrack(track, this.stream)
                })
            }
            this._pc.ontrack = (event) => {
                // this.duplex._onTrack(event)
            }
        } else {
            // Chrome, etc. This can be removed once all browsers support `ontrack`
            if (this.stream) this._pc.addStream(this.stream);
            this._pc.onaddstream = (event) => {
                // this.duplex._onAddStream(event)
            }
        }

        // HACK: wrtc doesn't fire the 'negotionneeded' event
        if (this.initiator && this._isWrtc) {
            this._pc.onnegotiationneeded()
        }

        this._onFinishBound = () => {
            this._onFinish()
        };
        this.once('finish', this._onFinishBound)

    }

    on(event, emitted, context) {
        return this.emitter.on(event, emitted, context)
    }


    once(event, emitted, context) {
        return this.emitter.once(event, emitted, context)
    }

    emit(eventName, ...args) {
        return this.emitter.emit(eventName, args);
    }

    removeListener(event, emitted, context) {
        return this.emitter.removeListener(event, emitted, context);
    }


    randombytes(arg) {
        return cryptoImpl.randomBytes(arg);
    }

    getBrowserRTC() {
        if (typeof window === 'undefined') return null
        var wrtc = {
            RTCPeerConnection: window.RTCPeerConnection || window.mozRTCPeerConnection ||
            window.webkitRTCPeerConnection,
            RTCSessionDescription: window.RTCSessionDescription ||
            window.mozRTCSessionDescription || window.webkitRTCSessionDescription,
            RTCIceCandidate: window.RTCIceCandidate || window.mozRTCIceCandidate ||
            window.webkitRTCIceCandidate
        }
        if (!wrtc.RTCPeerConnection) return null
        return wrtc
    }


    address() {

        return {port: this.localPort, family: 'IPv4', address: this.localAddress}
    }

    _addIceCandidate(candidate) {

        try {
            this._pc.addIceCandidate(
                new this._wrtc.RTCIceCandidate(candidate),
                this.noop(),
                (err) => {
                    this.destroy(err)
                }
            )
        } catch (err) {
            this.destroy(new Error('error adding candidate: ' + err.message))
        }
    }

    _onIceCandidate(event) {

        if (this.destroyed) return;
        if (event.candidate && this.trickle) {
            this.emit('signal', {
                candidate: {
                    candidate: event.candidate.candidate,
                    sdpMLineIndex: event.candidate.sdpMLineIndex,
                    sdpMid: event.candidate.sdpMid
                }
            })
        } else if (!event.candidate) {
            this._iceComplete = true;
            this.emit('_iceComplete')
        }
    }

    _maybeReady() {

        if (this.connected || this._connecting || !this._pcReady || !this._channelReady) return;

        this._connecting = true;

        // HACK: We can't rely on order here, for details see https://github.com/js-platform/node-webrtc/issues/339


        this.findCandidatePair();
    }

    findCandidatePair() {
        if (this.destroyed) return;

        this.getStats((err, items) => {
            if (this.destroyed) return;

            // Treat getStats error as non-fatal. It's not essential.
            if (err) items = [];

            var remoteCandidates = {};
            var localCandidates = {};
            var candidatePairs = {};
            // var foundSelectedCandidatePair = false;
            this.foundSelectedCandidatePair = false;

            items.forEach((item) => {
                // TODO: Once all browsers support the hyphenated stats report types, remove
                // the non-hypenated ones
                if (item.type === 'remotecandidate' || item.type === 'remote-candidate') {
                    remoteCandidates[item.id] = item
                }
                if (item.type === 'localcandidate' || item.type === 'local-candidate') {
                    localCandidates[item.id] = item
                }
                if (item.type === 'candidatepair' || item.type === 'candidate-pair') {
                    candidatePairs[item.id] = item
                }
            });

            items.forEach((item) => {
                // Spec-compliant
                if (item.type === 'transport') {
                    this.setSelectedCandidatePair(candidatePairs[item.selectedCandidatePairId], localCandidates, remoteCandidates)
                }

                // Old implementations
                if (
                    (item.type === 'googCandidatePair' && item.googActiveConnection === 'true') ||
                    ((item.type === 'candidatepair' || item.type === 'candidate-pair') && item.selected)
                ) {
                    this.setSelectedCandidatePair(item, localCandidates, remoteCandidates)
                }
            });


            // console.log(!this.foundSelectedCandidatePair && (!Object.keys(candidatePairs).length || Object.keys(localCandidates).length)); //todo remove debug item
            // Ignore candidate pair selection in browsers like Safari 11 that do not have any local or remote candidates
            // But wait until at least 1 candidate pair is available
            if (!this.foundSelectedCandidatePair && (!Object.keys(candidatePairs).length || Object.keys(localCandidates).length)) {
                setTimeout(this.findCandidatePair.bind(this), 100);
                return
            } else {
                this._connecting = false;
                this.connected = true
            }

            if (this._chunk) {
                try {
                    this.send(this._chunk)
                } catch (err) {
                    return this.destroy(err)
                }
                this._chunk = null;
                // console.log('sent chunk from "write before connect"');

                var cb = this._cb;
                this._cb = null;
                cb(null)
            }

            // If `bufferedAmountLowThreshold` and 'onbufferedamountlow' are unsupported,
            // fallback to using setInterval to implement backpressure.
            if (typeof this._channel.bufferedAmountLowThreshold !== 'number') {
                this._interval = setInterval(() => {
                    this._onInterval()
                }, 150);
                if (this._interval.unref) this._interval.unref()
            }

            console.log('WebRTC connect');
            this.emit('connect')
        })
    }

    setSelectedCandidatePair(selectedCandidatePair, localCandidates, remoteCandidates) {
        this.foundSelectedCandidatePair = true;

        var local = localCandidates[selectedCandidatePair.localCandidateId];
        if (local && local.ip) {
            // Spec
            this.localAddress = local.ip;
            this.localPort = Number(local.port)
        } else if (local && local.ipAddress) {
            // Firefox
            this.localAddress = local.ipAddress;
            this.localPort = Number(local.portNumber)
        } else if (typeof selectedCandidatePair.googLocalAddress === 'string') {
            // TODO: remove this once Chrome 58 is released
            local = selectedCandidatePair.googLocalAddress.split(':');
            this.localAddress = local[0];
            this.localPort = Number(local[1])
        }

        var remote = remoteCandidates[selectedCandidatePair.remoteCandidateId];

        if (remote && remote.ip) {
            // Spec
            this.remoteAddress = remote.ip;
            this.remotePort = Number(remote.port)
        } else if (remote && remote.ipAddress) {
            // Firefox
            this.remoteAddress = remote.ipAddress;
            this.remotePort = Number(remote.portNumber)
        } else if (typeof selectedCandidatePair.googRemoteAddress === 'string') {
            // TODO: remove this once Chrome 58 is released
            remote = selectedCandidatePair.googRemoteAddress.split(':');
            this.remoteAddress = remote[0];
            this.remotePort = Number(remote[1])
        }
        this.remoteFamily = 'IPv4';

        console.log(
            'connect local: %s:%s remote: %s:%s',
            this.localAddress, this.localPort, this.remoteAddress, this.remotePort
        )
    }

    _onIceStateChange() {

        if (this.destroyed) return;
        var iceConnectionState = this._pc.iceConnectionState;
        var iceGatheringState = this._pc.iceGatheringState;

        // TODO Dev Item
        // console.log(
        //     'iceStateChange (connection: %s) (gathering: %s)',
        //     iceConnectionState,
        //     iceGatheringState
        // );
        this.emit('iceStateChange', iceConnectionState, iceGatheringState);

        if (iceConnectionState === 'connected' || iceConnectionState === 'completed') {
            clearTimeout(this._reconnectTimeout);
            this._pcReady = true;
            this._maybeReady()
        }
        if (iceConnectionState === 'disconnected') {
            if (this.reconnectTimer) {
                // If user has set `opt.reconnectTimer`, allow time for ICE to attempt a reconnect
                clearTimeout(this._reconnectTimeout);
                this._reconnectTimeout = setTimeout(() => {
                    this.destroy()
                }, this.reconnectTimer)
            } else {
                this.destroy()
            }
        }
        if (iceConnectionState === 'failed') {
            this.destroy(new Error('Ice connection failed.'))
        }
        if (iceConnectionState === 'closed') {
            this.destroy()
        }
    }


    _onSignalingStateChange() {

        if (this.destroyed) return;
        this.emit('signalingStateChange', this._pc.signalingState)
    }

    signal(data) {
        data = data[0];
        if (this.destroyed) throw new Error('cannot signal after peer is destroyed');
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data)
            } catch (err) {
                data = {}
            }
        }
        console.log('signal()');

        if (data.candidate) {
            if (this._pc.remoteDescription && this._pc.remoteDescription.type) this._addIceCandidate(data.candidate);
            else this._pendingCandidates.push(data.candidate)
        }
        if (data.sdp) {
            this._pc.setRemoteDescription(new (this._wrtc.RTCSessionDescription)(data), () => {
                if (this.destroyed) return;

                this._pendingCandidates.forEach((candidate) => {
                    this._addIceCandidate(candidate)
                });
                this._pendingCandidates = [];

                if (this._pc.remoteDescription.type === 'offer') this._createAnswer()
            }, (err) => {
                this.destroy(err)
            })
        }
        if (!data.sdp && !data.candidate) {
            this.destroy(new Error('signal() called with invalid signal data'))
        }
    }

    _createOffer() {

        if (this.destroyed) return;

        this._pc.createOffer((offer) => {
            if (this.destroyed) return;
            offer.sdp = this.sdpTransform(offer.sdp);
            this._pc.setLocalDescription(offer, onSuccess.bind(this), onError.bind(this));

            function onSuccess() {
                if (this.destroyed) return;
                if (this.trickle || this._iceComplete) sendOffer();
                else this.once('_iceComplete', sendOffer.bind(this)) // wait for candidates
            }

            function onError(err) {
                this.destroy(err)
            }

            function sendOffer() {
                var signal = this._pc.localDescription || offer;
                this.emit('signal', {
                    type: signal.type,
                    sdp: signal.sdp
                })
            }
        }, (err) => {
            this.destroy(err)
        }, this.offerConstraints)
    }

    _createAnswer() {

        if (this.destroyed) return;

        this._pc.createAnswer((answer) => {
            if (this.destroyed) return;
            answer.sdp = this.sdpTransform(answer.sdp);
            this._pc.setLocalDescription(answer, onSuccess.bind(this), onError.bind(this));

            function onSuccess() {
                if (this.destroyed) return;
                if (this.trickle || this._iceComplete) sendAnswer();
                else this.once('_iceComplete', sendAnswer.bind(this))
            }

            function onError(err) {
                this.destroy(err)
            }

            function sendAnswer() {
                var signal = this._pc.localDescription || answer;
                this.emit('signal', {
                    type: signal.type,
                    sdp: signal.sdp
                })
            }
        }, (err) => {
            this.destroy(err)
        }, this.answerConstraints)
    }

    /**
     * Send text/binary data to the remote peer.
     * @param {ArrayBufferView|ArrayBuffer|Buffer|string|Blob} chunk
     */
    send(chunk) {
        this._channel.send(chunk)
    }

    _setupData(event) {

        if (!event.channel) {
            // In some situations `pc.createDataChannel()` returns `undefined` (in wrtc),
            // which is invalid behavior. Handle it gracefully.
            // See: https://github.com/feross/simple-peer/issues/163
            return this.destroy(new Error('Data channel event is missing `channel` property'))
        }

        this._channel = event.channel;
        this._channel.binaryType = 'arraybuffer';

        if (typeof this._channel.bufferedAmountLowThreshold === 'number') {
            this._channel.bufferedAmountLowThreshold = this.MAX_BUFFERED_AMOUNT
        }

        this.channelName = this._channel.label;

        this._channel.onmessage = (event) => {
            this._onChannelMessage(event)
        };
        this._channel.onbufferedamountlow = () => {
            this._onChannelBufferedAmountLow()
        };
        this._channel.onopen = () => {
            this._onChannelOpen()
        };
        this._channel.onclose = () => {
            this._onChannelClose()
        };
        this._channel.onerror = (err) => {
            this.destroy(err)
        }
    }

    _onChannelMessage(event) {

        if (this.destroyed) return;
        var data = event.data;
        if (data instanceof ArrayBuffer) data = Buffer.from(data);
        this.emit("data", event.data);
        // this.readableStream.push(data)
    }

    _onChannelBufferedAmountLow() {

        if (this.destroyed || !this._cb) return;
        console.log('ending backpressure: bufferedAmount %d', this._channel.bufferedAmount);
        var cb = this._cb;
        this._cb = null;
        cb(null)
    }

    _onChannelOpen() {

        if (this.connected || this.destroyed) return;
        this._channelReady = true;
        this._maybeReady()
    }

    _onChannelClose() {

        if (this.destroyed) return;
        this.destroy()
    }

    // When stream finishes writing, close socket. Half open connections are not
// supported.
    _onFinish() {

        if (this.destroyed) return;

        if (this.connected) {
            destroySoon().bind(this);
        } else {
            this.once('connect', destroySoon.bind(this))
        }

        // Wait a bit before destroying so the socket flushes.
        // TODO: is there a more reliable way to accomplish this?
        function destroySoon() {
            setTimeout(() => {
                this.destroy().bind(this);
            }, 1000)
        }
    }


    getStats(cb) {
        // Promise-based getStats() (standard)
        if (this._pc.getStats.length === 0) {
            this._pc.getStats().then((res) => {
                var reports = []
                res.forEach((report) => {
                    reports.push(report)
                })
                cb(null, reports)
            }, (err) => {
                cb(err)
            })

            // Two-parameter callback-based getStats() (deprecated, former standard)
        } else if (this._isReactNativeWebrtc) {
            this._pc.getStats(null, (res) => {
                var reports = []
                res.forEach((report) => {
                    reports.push(report)
                })
                cb(null, reports)
            }, (err) => {
                cb(err)
            })

            // Single-parameter callback-based getStats() (non-standard)
        } else if (this._pc.getStats.length > 0) {
            this._pc.getStats((res) => {
                // If we destroy connection in `connect` callback this code might happen to run when actual connection is already closed
                if (this.destroyed) return

                var reports = []
                res.result().forEach((result) => {
                    var report = {}
                    result.names().forEach((name) => {
                        report[name] = result.stat(name)
                    })
                    report.id = result.id
                    report.type = result.type
                    report.timestamp = result.timestamp
                    reports.push(report)
                })
                cb(null, reports)
            }, (err) => {
                cb(err)
            })

            // Unknown browser, skip getStats() since it's anyone's guess which style of
            // getStats() they implement.
        } else {
            cb(null, [])
        }
    }


    _onInterval() {
        if (!this._cb || !this._channel || this._channel.bufferedAmount > this.MAX_BUFFERED_AMOUNT) {
            return
        }
        this._onChannelBufferedAmountLow()
    }

    // TODO: Delete this method once readable-stream is updated to contain a default
// implementation of destroy() that automatically calls _destroy()
// See: https://github.com/nodejs/readable-stream/issues/283
    destroy(err) {

        this._destroy(err, () => {
        })
    }

    _destroy(err, cb) {

        if (this.destroyed) return;

        console.log('destroy (error: %s)', err && (err.message || err));

        this.readable = this.writable = false;
        // if (!this.readableStream._readableState.ended) this.readableStream.push(null);
        // if (!this.readableStream._writableState.finished) this.readableStream.end();

        this.destroyed = true;
        this.connected = false;
        this._pcReady = false;
        this._channelReady = false;
        this._previousStreams = null;

        clearInterval(this._interval);
        clearTimeout(this._reconnectTimeout);
        this._interval = null;
        this._reconnectTimeout = null;
        this._chunk = null;
        this._cb = null;

        if (this._onFinishBound) this.removeListener('finish', this._onFinishBound);
        this._onFinishBound = null;

        if (this._pc) {
            try {
                this._pc.close()
            } catch (err) {
            }

            this._pc.oniceconnectionstatechange = null;
            this._pc.onicegatheringstatechange = null;
            this._pc.onsignalingstatechange = null;
            this._pc.onicecandidate = null;
            if ('addTrack' in this._pc) {
                this._pc.ontrack = null
            } else {
                this._pc.onaddstream = null
            }
            this._pc.onnegotiationneeded = null;
            this._pc.ondatachannel = null
        }

        if (this._channel) {
            try {
                this._channel.close()
            } catch (err) {
            }

            this._channel.onmessage = null;
            this._channel.onopen = null;
            this._channel.onclose = null;
            this._channel.onerror = null
        }
        this._pc = null;
        this._channel = null;

        if (err) this.emit('error', err);
        this.emit('close');
        cb()
    }

    // Transform constraints objects into the new format (unless Chromium)
// TODO: This can be removed when Chromium supports the new format
    _transformConstraints(constraints) {


        if (Object.keys(constraints).length === 0) {
            return constraints
        }

        if ((constraints.mandatory || constraints.optional) && !this._isChromium) {
            // convert to new format

            // Merge mandatory and optional objects, prioritizing mandatory
            var newConstraints = Object.assign({}, constraints.optional, constraints.mandatory);

            // fix casing
            if (newConstraints.OfferToReceiveVideo !== undefined) {
                newConstraints.offerToReceiveVideo = newConstraints.OfferToReceiveVideo;
                delete newConstraints['OfferToReceiveVideo']
            }

            if (newConstraints.OfferToReceiveAudio !== undefined) {
                newConstraints.offerToReceiveAudio = newConstraints.OfferToReceiveAudio;
                delete newConstraints['OfferToReceiveAudio']
            }

            return newConstraints
        } else if (!constraints.mandatory && !constraints.optional && this._isChromium) {
            // convert to old format

            // fix casing
            if (constraints.offerToReceiveVideo !== undefined) {
                constraints.OfferToReceiveVideo = constraints.offerToReceiveVideo;
                delete constraints['offerToReceiveVideo']
            }

            if (constraints.offerToReceiveAudio !== undefined) {
                constraints.OfferToReceiveAudio = constraints.offerToReceiveAudio;
                delete constraints['offerToReceiveAudio']
            }

            return {
                mandatory: constraints // NOTE: All constraints are upgraded to mandatory
            }
        }

        return constraints
    }


    _debug() {
        var args = [].slice.call(arguments);
        args[0] = '[' + this._id + '] ' + args[0];
        console.debug(args);
    }

    _read() {
    }

    _write(chunk, encoding, cb) {

        if (this.destroyed) return cb(new Error('cannot write after peer is destroyed'));

        if (this.connected) {
            try {
                this.send(chunk)
            } catch (err) {
                return this.destroy(err)
            }
            if (this._channel.bufferedAmount > this.MAX_BUFFERED_AMOUNT) {
                console.log('start backpressure: bufferedAmount %d', this._channel.bufferedAmount);
                this._cb = cb
            } else {
                cb(null)
            }
        } else {
            console.log('write before connect');
            this._chunk = chunk;
            this._cb = cb
        }
    }

    noop() {
    }
}


if(isNode){
    module.exports = MewRTC;
}

