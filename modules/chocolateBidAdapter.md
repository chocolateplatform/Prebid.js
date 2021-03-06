# Overview

```
Module Name: chocolate Bidder Adapter
Module Type: Bidder Adapter
Maintainer: kevin.kawai@chocolateplatform.com
```

# Description

Connects to chocolate exchange for bids.

chocolate bid adapter supports Video ads currently.

For more information about [chocolate Ad Serving and Management](https://vdopia.atlassian.net/wiki/spaces/RC/pages/34177028/Web+Server+Ad+API+-+v1.1), please contact [gdm@chocolateplatform.com](gdm@chocolateplatform.com).

# Sample Ad Unit: For Publishers
```javascript
var videoAdUnit = [
{
    code: 'video1',
    sizes: [
        [300, 250],
        [320, 480],
        [768, 1024]
    ],
    bids: [{
        bidder: 'chocolate',
        params: {

        'ak': 'AX123',
        'adFormat': 'preappvideo',
        'channelType': 'site',
        'pageURL': 'http://mysite.com/awesome.html',
        'domain': 'mysite.com',
        'siteName': 'My Awesome Blog',
        'category': 'IAB12',
        'version': '1.1',
        'apiFramework': '2,5',
        'di': 'cookie or partner unique user identifier',
        'dif': 'fpcm',
        'size': '320x480'

        }
    }]
}];
```

# Configuration

The chocolate Bidder Adapter expects Prebid Cache to be enabled so that we can store and retrieve a single vastXml. If this value is not set it will have to use vastUrl to make a duplicate call to the SSP and cannot guarantee the same ad will be received after auctionEnd.

```javascript
pbjs.setConfig({
    usePrebidCache: true,
    cache: {
        url: 'https://prebid.adnxs.com/pbc/v1/cache'
    }
});
```
