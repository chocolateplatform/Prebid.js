import { spec } from 'modules/chocolateBidAdapter';
import { newBidder } from 'src/adapters/bidderFactory';
const { expect } = require('chai');

describe('Chocolate Bid Adapter Test', function () {
  const adapter = newBidder(spec);

  describe('inherited functions', function () {
    it('exists and is a function', function () {
      expect(adapter.callBids).to.exist.and.to.be.a('function');
    });
  });

  describe('isBidRequestValid', function () {
    let bid = {
      'bidder': 'chocolate',
      'params': {
        'ak': 'AX123',
        'adFormat': 'preappvideo',
        'channelType': 'site',
        'pageURL': 'http://mysite.com/awesome.html',
        'domain': 'mysite.com',
        'siteName': 'My Awesome Blog',
        'category': 'IAB12',
        'apiFramework': '1,2,3,4,5',
        'displayManager': 'Chocolate-Web',
        'displayManagerVer': '2.6.0-web',
        'version': '1.1',
        'dnt': '0',
        'gdpr': 0,
        'size': '320x480',
        'testEndPoint': 'http://abhay.dev.vdopia.com/vast/rtb_vpaid.php'
      },
      'adUnitCode': 'video1',
      'sizes': [[300, 250], [640, 480]],
      'bidId': '30b31c1838de1e',
      'bidderRequestId': '22edbae2733bf6',
      'requestId': 'a09c66c3-53e3-4428-b296-38fc08e7cd2a',
      'transactionId': 'd6f6b392-54a9-454c-85fb-a2fd882c4a2d',
    };

    it('should return true when required params found', function () {
      expect(spec.isBidRequestValid(bid)).to.equal(true);
    });

    it('should return false when required params are not passed', function () {
      let bid = Object.assign({}, bid);
      delete bid.params;
      bid.params = {
        wrong: 'missing zone id'
      };
      expect(spec.isBidRequestValid(bid)).to.equal(false);
    });
  });

  describe('buildRequests', function () {
    const ENDPOINT = 'http://abhay.dev.vdopia.com/vast/rtb_vpaid.php';
    let bidRequests = [
      {
        'bidder': 'chocolate',
        'params': {
          'ak': 'AX123',
          'adFormat': 'preappvideo',
          'channelType': 'site',
          'pageURL': 'http://mysite.com/awesome.html',
          'domain': 'mysite.com',
          'siteName': 'My Awesome Blog',
          'category': 'IAB12',
          'apiFramework': '1,2,3,4,5',
          'displayManager': 'Chocolate-Web',
          'displayManagerVer': '2.6.0-web',
          'version': '1.1',
          'dnt': '0',
          'gdpr': 0,
          'size': '320x480',
          'testEndPoint': 'http://abhay.dev.vdopia.com/vast/rtb_vpaid.php'
        },
        'adUnitCode': 'chocolate',
        'sizes': [[300, 250], [640, 480]],
        'bidId': '30b31c1838de1e',
        'bidderRequestId': '22edbae2733bf6',
        'requestId': 'a09c66c3-53e3-4428-b296-38fc08e7cd2a',
        'transactionId': 'd6f6b392-54a9-454c-85fb-a2fd882c4a2d',
      }
    ];
    let bidRequest = [
      {
        'bidder': 'chocolate',
        'params': {
          'ak': 'AX123',
          'adFormat': 'preappvideo',
          'channelType': 'site',
          'pageURL': 'http://mysite.com/awesome.html',
          'domain': 'mysite.com',
          'siteName': 'My Awesome Blog',
          'category': 'IAB12',
          'apiFramework': '1,2,3,4,5',
          'displayManager': 'Chocolate-Web',
          'displayManagerVer': '2.6.0-web',
          'version': '1.1',
          'dnt': '0',
          'gdpr': 0,
          'size': '320x480',
          'testEndPoint': 'http://abhay.dev.vdopia.com/vast/rtb_vpaid.php'
        },
        'adUnitCode': 'chocolate',
        'sizes': [640, 480],
        'bidId': '30b31c1838de1e',
        'bidderRequestId': '22edbae2733bf6',
        'requestId': 'a09c66c3-53e3-4428-b296-38fc08e7cd2a',
        'transactionId': 'd6f6b392-54a9-454c-85fb-a2fd882c4a2d',
      }
    ];

    it('should populate available parameters', function () {
      const requests = spec.buildRequests(bidRequests);
      expect(requests.length).to.equal(2);
      const r1 = requests[0].data;
      expect(r1).to.have.property('ak');
      expect(r1.ak).to.equal('AX123');
      expect(r1).to.have.property('adFormat');
      expect(r1.adFormat).to.equal('preappvideo');
      expect(r1).to.have.property('size');
      expect(r1.size).to.equal('320x480');
      expect(r1).to.have.property('width');
      expect(r1.width).to.equal(300);
      expect(r1).to.have.property('height');
      expect(r1.height).to.equal(250);
      const r2 = requests[1].data;
      expect(r2).to.have.property('ak');
      expect(r2.ak).to.equal('AX123');
      expect(r2).to.have.property('adFormat');
      expect(r2.adFormat).to.equal('preappvideo');
      expect(r2).to.have.property('width');
      expect(r2.width).to.equal(640);
      expect(r2).to.have.property('height');
      expect(r2.height).to.equal(480);
      expect(r2).to.have.property('size');
      expect(r2.size).to.equal('320x480');
    });

    it('should not populate unspecified parameters', function () {
      const requests = spec.buildRequests(bidRequests);
      expect(requests.length).to.equal(2);
      const r1 = requests[0].data;
      expect(r1).to.not.have.property('pageurl');
      expect(r1).to.not.have.property('contentid');
      expect(r1).to.not.have.property('contenttitle');
      expect(r1).to.not.have.property('contentlength');
      expect(r1).to.not.have.property('contenturl');
      const r2 = requests[1].data;
      expect(r2).to.not.have.property('pageurl');
      expect(r2).to.not.have.property('contentid');
      expect(r2).to.not.have.property('contenttitle');
      expect(r2).to.not.have.property('contentlength');
      expect(r2).to.not.have.property('contenturl');
    });

    it('should handle single size request', function () {
      const requests = spec.buildRequests(bidRequest);
      expect(requests.length).to.equal(1);
      const r1 = requests[0].data;
      expect(r1).to.have.property('ak');
      expect(r1.ak).to.equal('AX123');
      expect(r1).to.have.property('adFormat');
      expect(r1.adFormat).to.equal('preappvideo');
      expect(r1).to.have.property('width');
      expect(r1.width).to.equal(640);
      expect(r1).to.have.property('height');
      expect(r1.height).to.equal(480);
    });

    it('sends bid request to ENDPOINT via GET', function () {
      const requests = spec.buildRequests(bidRequests);
      expect(requests.length).to.equal(2);
      const r1 = requests[0];
      expect(r1.url).to.contain(ENDPOINT);
      expect(r1.method).to.equal('GET');
      const r2 = requests[1]
      expect(r2.url).to.contain(ENDPOINT);
      expect(r2.method).to.equal('GET');
    });
  });

  describe('interpretResponse', function () {
    let bidRequest = {
      'url': 'http://abhay.dev.vdopia.com/vast/rtb_vpaid.php',
      'data': {
        'bidId': '253dcb69fb2577',
        'bidWidth': '640',
        'bidHeight': '480'
      }
    };
    let serverResponse = {id: 'vdopia-response', seatbid: [{seat: 'vdopia_vast_vpaid_seat1', bid: [{impid: '1', price: 10, id: 'vdopia_vast_vpaid_seat1', adm: '<?xml version=\"1.0\"?>\n<VAST version=\"2.0\">\n<Ad id=\"1h41kg\">\n<InLine>\n<AdSystem>Innovid Ads<\/AdSystem>\n<AdTitle><![CDATA[Certification Testing VPAID - MRAID - Click on Main copy (5\/20\/2016)]]><\/AdTitle>\n<Impression><![CDATA[about:blank]]><\/Impression>\n<Creatives>\n<Creative>\n<Linear>\n<Duration>00:00:15<\/Duration>\n<MediaFiles>\n<MediaFile delivery=\"progressive\" width=\"16\" height=\"9\" type=\"application\/javascript\" apiFramework=\"VPAID\"><![CDATA[http:\/\/static.innovid.com\/mobileapps\/js\/vpaid\/1h41kg?cb=52c4329b-97b2-d2a7-538d-04678b22317e&deviceid=&ivc=iv_geo_dma%3D807%26iv_geo_country%3DUS%26iv_geo_city%3DSan+Francisco%26iv_geo_state%3DCA%26iv_geo_zip%3D94105%26iv_geo_lat%3D37.7864%26iv_geo_lon%3D-122.3892]]><\/MediaFile>\n<\/MediaFiles>\n<\/Linear>\n<\/Creative>\n<\/Creatives>\n<\/InLine>\n<\/Ad>\n<\/VAST>', adomain: ['http:\/\/abc.com', 'http:\/\/xyz.com'], crid: '565577757', cid: '55421', iurl: 'http:\/\/cdn.vdopia.com'}]}], cur: 'USD'};
    serverResponse.body = serverResponse;

    it('should correctly parse valid bid response', function () {
      const BIDDER_CODE = 'chocolate';
      let bidResponses = spec.interpretResponse(serverResponse, bidRequest);
      expect(bidResponses.length).to.equal(1);
      let bidResponse = bidResponses[0];
      expect(bidResponse.bidderCode).to.equal(BIDDER_CODE);
      expect(bidResponse.currency).to.equal('USD');
      expect(bidResponse.cpm).to.equal(10);
      expect(bidResponse.creativeId).to.equal('565577757');
    });

    it('safely handles XML parsing failure from invalid bid response', function () {
      let invalidServerResponse = {};
      invalidServerResponse.body = '<Ad id="677477"><InLine></AdSystem></InLine></Ad>';

      let result = spec.interpretResponse(invalidServerResponse, bidRequest);
      expect(result.length).to.equal(0);
    });

    it('handles nobid responses', function () {
      let nobidResponse = {};
      nobidResponse.body = '<?xml version=\'1.0\' encoding=\'UTF-8\'?><VAST version=\'2.0\'></VAST>';

      let result = spec.interpretResponse(nobidResponse, bidRequest);
      expect(result.length).to.equal(0);
    });
  });
});
