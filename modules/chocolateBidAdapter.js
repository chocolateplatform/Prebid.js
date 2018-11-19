import * as utils from 'src/utils';
import { registerBidder } from 'src/adapters/bidderFactory';
import { BANNER, VIDEO } from 'src/mediaTypes';

const IS_CONSOLE_LOG_ON = true;
const BIDDER_CODE = 'chocolate';
const BID_TTL_DEFAULT = 2000;
const ENDPOINT = 'http://serve.vdopia.com/adserver/html5/inwapads/';

const PARAM_OUTPUT_DEFAULT = 'vast';
const PARAM_EXECUTION_DEFAULT = 'any';
const PARAM_SUPPORT_DEFAULT = 'html5';
const PARAM_PLAYINIT_DEFAULT = 'auto';
const PARAM_VOLUME_DEFAULT = '100';

function consoleLog(message) {
  if (IS_CONSOLE_LOG_ON) {
    console.log(message)
  }
}

function _isValidString(someStr) {
  consoleLog('_isValidString')
  if (someStr && typeof someStr !== 'undefined') {
    return true;
  }

  return false;
}

function isBidRequestValid(bidRequest) {
  consoleLog('isBidRequestValid')
  if (bidRequest.bidder === BIDDER_CODE && typeof bidRequest.params !== 'undefined') {
    if (_isValidString(bidRequest.params.ak) &&
      _isValidString(bidRequest.params.adFormat) &&
      _isValidString(bidRequest.params.channelType) &&
      _isValidString(bidRequest.params.pageURL) &&
      _isValidString(bidRequest.params.domain) &&
      _isValidString(bidRequest.params.siteName) &&
      _isValidString(bidRequest.params.category) &&
      _isValidString(bidRequest.params.apiFramework) &&
      _isValidString(bidRequest.params.version)) {
      if (bidRequest.params.hasOwnProperty('requester') && bidRequest.params.requester != null) {
        if (bidRequest.params.hasOwnProperty('requesterClose') && bidRequest.params.requesterClose != null) {
          return parseInt(bidRequest.params.requesterClose) >= -1;
        }
      }

      consoleLog('isBidRequestValid: true')
      return true;
    }
  }
  consoleLog('isBidRequestValid: not a valid bid request; check website required bid params')
  return false;
}

function buildRequests(validBidRequests) {
  consoleLog('buildRequests')
  let bidRequests = [];
  for (let i = 0; i < validBidRequests.length; i++) {
    let bidRequest = validBidRequests[i];

    // if width/height not provided to the ad unit for some reason then attempt request with default 640x480 size
    if (!bidRequest.sizes || !bidRequest.sizes.length) {
      utils.logWarn('Warning: Could not find valid width/height parameters on the provided adUnit');
      bidRequest.sizes = [[320, 480]];
    }

    // JWPlayer demo page uses sizes: [640,480] instead of sizes: [[640,480]] so need to handle single-layer array as well as nested arrays
    if (bidRequest.sizes.length === 2 && typeof bidRequest.sizes[0] === 'number' && typeof bidRequest.sizes[1] === 'number') {
      let adWidth = bidRequest.sizes[0];
      let adHeight = bidRequest.sizes[1];
      bidRequest.sizes = [[adWidth, adHeight]];
    }

    for (let j = 0; j < bidRequest.sizes.length; j++) {
      let size = bidRequest.sizes[j];
      let playerWidth;
      let playerHeight;
      if (size && size.length == 2) {
        playerWidth = size[0];
        playerHeight = size[1];
      } else {
        utils.logWarn('Warning: Could not determine width/height from the provided adUnit');
      }

      let sspUrl = ENDPOINT.concat();
      let sspData = {};

      // required parameters
      sspData.ak = bidRequest.params.ak;
      sspData.adFormat = bidRequest.params.adFormat;
      sspData.channelType = bidRequest.params.channelType;
      sspData.pageURL = bidRequest.params.pageURL;
      sspData.domain = bidRequest.params.domain;
      sspData.siteName = bidRequest.params.siteName;
      sspData.category = bidRequest.params.category;
      sspData.apiFramework = bidRequest.params.apiFramework;
      sspData.version = bidRequest.params.version;
      sspData.size = playerWidth + 'x' + playerHeight;
      sspData.caller = 'prebid';
      sspData.prebid = true;

      // optional parameters
      if (bidRequest.params.hasOwnProperty('output') && bidRequest.params.output != null) {
        sspData.output = bidRequest.params.output;
      } else {
        sspData.output = PARAM_OUTPUT_DEFAULT;
      }
      if (bidRequest.params.hasOwnProperty('execution') && bidRequest.params.execution != null) {
        sspData.execution = bidRequest.params.execution;
      } else {
        sspData.execution = PARAM_EXECUTION_DEFAULT;
      }
      if (bidRequest.params.hasOwnProperty('support') && bidRequest.params.support != null) {
        sspData.support = bidRequest.params.support;
      } else {
        sspData.support = PARAM_SUPPORT_DEFAULT;
      }
      if (bidRequest.params.hasOwnProperty('playinit') && bidRequest.params.playinit != null) {
        sspData.playinit = bidRequest.params.playinit;
      } else {
        sspData.playinit = PARAM_PLAYINIT_DEFAULT;
      }
      if (bidRequest.params.hasOwnProperty('volume') && bidRequest.params.volume != null) {
        sspData.volume = bidRequest.params.volume;
      } else {
        sspData.volume = PARAM_VOLUME_DEFAULT;
      }
      if (playerWidth) {
        sspData.width = playerWidth;
      }
      if (playerHeight) {
        sspData.height = playerHeight;
      }

      // optional chocolate parameters
      if (bidRequest.params.hasOwnProperty('testEndPoint') && bidRequest.params.testEndPoint != null) {
        sspUrl = bidRequest.params.testEndPoint;
      }
      if (bidRequest.params.hasOwnProperty('displayManager') && bidRequest.params.displayManager != null) {
        sspData.displayManager = bidRequest.params.displayManager;
      }
      if (bidRequest.params.hasOwnProperty('displayManagerVer') && bidRequest.params.displayManagerVer != null) {
        sspData.displayManagerVer = bidRequest.params.displayManagerVer;
      }
      if (bidRequest.params.hasOwnProperty('gdpr') && bidRequest.params.gdpr != null) {
        sspData.gdpr = bidRequest.params.gdpr;
      }
      if (bidRequest.params.hasOwnProperty('consent') && bidRequest.params.consent != null) {
        sspData.consent = bidRequest.params.consent;
      }
      if (bidRequest.params.hasOwnProperty('dnt') && bidRequest.params.dnt != null) {
        sspData.dnt = bidRequest.params.dnt;
      }
      if (bidRequest.params.hasOwnProperty('dif') && bidRequest.params.dif != null) {
        sspData.dif = bidRequest.params.dif;
      }
      if (bidRequest.params.hasOwnProperty('di') && bidRequest.params.di != null) {
        sspData.di = bidRequest.params.di;
      }
      if (bidRequest.params.hasOwnProperty('requester') && bidRequest.params.requester != null) {
        sspData.requester = bidRequest.params.requester;

        if (bidRequest.params.hasOwnProperty('requesterClose') && bidRequest.params.requesterClose != null) {
          sspData.requesterClose = bidRequest.params.requesterClose;
        }
      }
      if (bidRequest.params.hasOwnProperty('refURL') && bidRequest.params.refURL != null) {
        sspData.refURL = bidRequest.params.refURL;
      }
      if (bidRequest.params.hasOwnProperty('ua') && bidRequest.params.ua != null) {
        sspData.ua = bidRequest.params.ua;
      }
      if (bidRequest.params.hasOwnProperty('ipAddress') && bidRequest.params.ipAddress != null) {
        sspData.ipAddress = bidRequest.params.ipAddress;
      }
      if (bidRequest.params.hasOwnProperty('serveBanner') && bidRequest.params.serveBanner != null) {
        sspData.serveBanner = bidRequest.params.serveBanner;
      }
      if (bidRequest.params.hasOwnProperty('autorender') && bidRequest.params.autorender != null) {
        sspData.autorender = bidRequest.params.autorender;
      }
      if (bidRequest.params.hasOwnProperty('showClose') && bidRequest.params.showClose != null) {
        sspData.showClose = bidRequest.params.showClose;
      }
      if (bidRequest.params.hasOwnProperty('closeTimeout') && bidRequest.params.closeTimeout != null) {
        sspData.closeTimeout = bidRequest.params.closeTimeout;
      }
      if (bidRequest.params.hasOwnProperty('loop') && bidRequest.params.loop != null) {
        sspData.loop = bidRequest.params.loop;
      }
      if (bidRequest.params.hasOwnProperty('sleepAfter') && bidRequest.params.sleepAfter != null) {
        sspData.sleepAfter = bidRequest.params.sleepAfter;
      }
      if (bidRequest.params.hasOwnProperty('container') && bidRequest.params.container != null) {
        sspData.container = bidRequest.params.container;
      }
      if (bidRequest.params.hasOwnProperty('locbot') && bidRequest.params.locbot != null) {
        sspData.locbot = bidRequest.params.locbot;
      }
      if (bidRequest.params.hasOwnProperty('target_params') && bidRequest.params.target_params != null) {
        sspData.target_params = bidRequest.params.target_params;
      }
      if (bidRequest.params.hasOwnProperty('invtracker') && bidRequest.params.invtracker != null) {
        sspData.invtracker = bidRequest.params.invtracker;
      }
      if (bidRequest.params.hasOwnProperty('pubendTrk') && bidRequest.params.pubendTrk != null) {
        sspData.pubendTrk = bidRequest.params.pubendTrk;
      }
      if (bidRequest.params.hasOwnProperty('pubct') && bidRequest.params.pubct != null) {
        sspData.pubct = bidRequest.params.pubct;
      }

      // optional chocolate targeting parameters
      if (bidRequest.params.hasOwnProperty('sex') && bidRequest.params.sex != null) {
        sspData.sex = bidRequest.params.sex;
      }
      if (bidRequest.params.hasOwnProperty('birthday') && bidRequest.params.birthday != null) {
        sspData.birthday = bidRequest.params.birthday;
      }
      if (bidRequest.params.hasOwnProperty('ethnicity') && bidRequest.params.ethnicity != null) {
        sspData.ethnicity = bidRequest.params.ethnicity;
      }
      if (bidRequest.params.hasOwnProperty('age') && bidRequest.params.age != null) {
        sspData.age = bidRequest.params.age;
      }
      if (bidRequest.params.hasOwnProperty('maritalstatus') && bidRequest.params.maritalstatus != null) {
        sspData.maritalstatus = bidRequest.params.maritalstatus;
      }
      if (bidRequest.params.hasOwnProperty('postalcode') && bidRequest.params.postalcode != null) {
        sspData.postalcode = bidRequest.params.postalcode;
      }
      if (bidRequest.params.hasOwnProperty('currpostal') && bidRequest.params.currpostal != null) {
        sspData.currpostal = bidRequest.params.currpostal;
      }
      if (bidRequest.params.hasOwnProperty('dmacode') && bidRequest.params.dmacode != null) {
        sspData.dmacode = bidRequest.params.dmacode;
      }
      if (bidRequest.params.hasOwnProperty('latlong') && bidRequest.params.latlong != null) {
        sspData.latlong = bidRequest.params.latlong;
      }
      if (bidRequest.params.hasOwnProperty('geoType') && bidRequest.params.geoType != null) {
        sspData.geoType = bidRequest.params.geoType;
      }
      if (bidRequest.params.hasOwnProperty('geo') && bidRequest.params.geo != null) {
        sspData.geo = bidRequest.params.geo;
      }
      if (bidRequest.params.hasOwnProperty('metro') && bidRequest.params.metro != null) {
        sspData.metro = bidRequest.params.metro;
      }
      if (bidRequest.params.hasOwnProperty('keywords') && bidRequest.params.keywords != null) {
        sspData.keywords = bidRequest.params.keywords;
      }
      if (bidRequest.params.hasOwnProperty('telhash') && bidRequest.params.telhash != null) {
        sspData.telhash = bidRequest.params.telhash;
      }
      if (bidRequest.params.hasOwnProperty('emailhash') && bidRequest.params.emailhash != null) {
        sspData.emailhash = bidRequest.params.emailhash;
      }

      // random number to prevent caching
      sspData.cb = Math.floor(Math.random() * 999999999);

      consoleLog('sspUrl: ' + sspUrl + ' sspData: ' + sspData.ak + ' adFormat: ' + sspData.adFormat + ' apiFramework: ' + sspData.apiFramework + ' sspData.size: ' + sspData.size + ' cb: ' + sspData.cb)

      // Prebid.js required properties
      sspData.bidId = bidRequest.bidId;
      sspData.bidWidth = playerWidth;
      sspData.bidHeight = playerHeight;

      bidRequests.push({
        method: 'GET',
        url: sspUrl,
        data: sspData,
        options: {withCredentials: false}
      });
    }
  }

  return bidRequests;
}

function interpretResponse(serverResponse, bidRequest) {
  consoleLog('interpretResponse: ' + serverResponse.body)
  let bidResponses = [];
  if (serverResponse && serverResponse.body) {
    consoleLog('interpretResponse: 1')
    if (serverResponse.error) {
      consoleLog('interpretResponse: 2')
      utils.logError('Error: ' + serverResponse.error);
      return bidResponses;
    } else {
      try {
        consoleLog('interpretResponse: 3')
        let bidResponse = {};
        if (bidRequest && bidRequest.data && bidRequest.data.bidId && bidRequest.data.bidId !== '') {
          consoleLog('interpretResponse: 4')
          let responseObj = serverResponse.body;
          if (responseObj != null) {
            bidResponse.requestId = bidRequest.data.bidId;
            bidResponse.bidderCode = BIDDER_CODE;
            bidResponse.vastUrl = '';
            bidResponse.vastXml = responseObj.seatbid[0].bid[0].adm;
            bidResponse.cpm = responseObj.seatbid[0].bid[0].price;
            bidResponse.creativeId = responseObj.seatbid[0].bid[0].crid;
            consoleLog('interpretResponse bidResponse.cpm: ' + bidResponse.cpm);
            bidResponse.currency = responseObj.cur;
            bidResponse.width = bidRequest.data.bidWidth;
            bidResponse.height = bidRequest.data.bidHeight;
            consoleLog('interpretResponse: width/height: ' + bidResponse.width + '/' + bidResponse.height)
            bidResponse.ttl = BID_TTL_DEFAULT;
            bidResponse.netRevenue = true;
            bidResponse.mediaType = VIDEO;

            bidResponses.push(bidResponse);
            consoleLog('interpretResponse: 5 bidId: ' + bidRequest.data.bidId)
          } else {
            utils.logError('Error: Server response contained invalid XML');
          }
        } else {
          utils.logError('Error: Could not associate bid request to server response');
        }
      } catch (e) {
        utils.logError('Error: Could not interpret server response');
      }
    }
  } else {
    utils.logError('Error: No server response or server response was empty for the requested URL');
  }

  return bidResponses;
}

export const spec = {
  code: BIDDER_CODE,
  supportedMediaTypes: [VIDEO],
  isBidRequestValid,
  buildRequests,
  interpretResponse,
  onTimeout: function(timeoutData) {
    consoleLog('onTimeout: bidder: ' + timeoutData.bidder + ' timeout: ' + timeoutData.timeout);
  },
  onBidWon: function(bid) {
    consoleLog('onBidWon: bidder: ' + bid.bidder + ' cpm: ' + bid.cpm);
  }
}

consoleLog('before registerBidder')
registerBidder(spec);
