'use strict'

import Peer from 'simple-peer'
import wrtc from 'wrtc'
import { stunServers, turnServers } from '@config'
import { rtcSignals } from '@signals'

export default class WebRTCConnection {
  constructor(options = {}) {
    this.options = options
    this.peer = {}
    this.listeners = {}
  }

  /**
   * Attempt to initiate an "offer" WebRTC connection between two peers.
   * This will return an offer object that can be used by the receiver to create a
   * p2p connection.
   *
   * If ICE servers are given, then use those instead. The object format returned
   * by twilio is incorrect. The 'url' properties must be renamed 'urls'
   *
   * @return {Object} - WebRTC connection offer
   */
  async offer(iceServers = null) {
    return new Promise((resolve, reject) => {
      const options = {
        initiator: true,
        trickle: false,
        iceTransportPolicy: 'relay',
        config: {
          iceServers: iceServers
            ? iceServers.map(obj => {
                const newObject = {}
                delete Object.assign(newObject, obj, { ['urls']: obj['url'] })[
                  'url'
                ]
                return newObject
              })
            : stunServers
        },
        wrtc: wrtc
      }

      this.peer = new Peer(options)
      this.peer.on(rtcSignals.signal, data => {
        resolve(data)
      })

    })
  }

  /**
   * Given a WebRTC offer object (created with the offer() function),
   * a receiver can create a WebRTC response in order to create a p2p
   * connection between the initiator and receiver.
   *
   * @param  {Object} offer - WebRTC offer object create with offer()
   * @return {Object} - WebRTC answer object, to be used by the initiator
   */
  async answer(offer, iceServers = null) {
    return new Promise((resolve, reject) => {
      const options = {
        trickle: false,
        iceTransportPolicy: 'relay',
        config: {
          iceServers: iceServers ? iceServers : stunServers
        },
        wrtc: wrtc
      }
      this.peer = new Peer(options)
      this.peer.on(rtcSignals.error, console.log)
      this.peer.signal(offer)
      this.peer.on(rtcSignals.signal, data => {
        resolve(data)
      })
    })
  }

  /**
   * Given a WebRTC answer object, complete WebRTC connection.
   * @param  {Object} answer - WebRTC answer object created by answer()
   */
  connect(answer) {
    this.peer.signal(answer)
  }

  /**
   * Disconnect from current WebRTC connection
   */
  disconnect() {
    this.peer.destroy()
  }

  /**
   * On @sigal event sent via WebRTC, perform given fn
   * @param  {String} signal - WebRTC signal/event. E.g. 'data'
   * @param  {Function} fn - Callback function to perform on signal event
   */
  on(signal, fn) {
    this.peer.on(signal, fn)
  }
}
