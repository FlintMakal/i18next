describe('post missing resources', function() {

  describe('to fallback', function() {
    var server, stub, spy; 

    beforeEach(function(done) {
      server = sinon.fakeServer.create();
      stub = sinon.stub(i18n.functions, "ajax");
      spy = sinon.spy(i18n.sync, 'postMissing');


      server.respondWith([200, { "Content-Type": "text/html", "Content-Length": 2 }, "OK"]);

      i18n.init(i18n.functions.extend(opts, {
        sendMissing: true,
        resStore: {
          'en-US': { translation: {  } },
          'en': { translation: {  } },
          'dev': { translation: {  } }
        }
      }), function(t) { done(); } );
    });

    afterEach(function() {
      server.restore();
      stub.restore();
      spy.restore();
    });

    it('it should post missing resource to server', function() {
      i18n.t('missing');
      server.respond();
      expect(stub.calledOnce).to.be(true);
    });

    it('it should post missing resource to server when language is passed in', function() {
      i18n.t('missing_en', { lng: 'en' });
      server.respond();
      expect(stub.calledOnce).to.be(true);
    });

    it('it should call with right arguments', function() {
      i18n.t('missing');
      expect(spy.args[0][0]).to.be('en-US');
      expect(spy.args[0][1]).to.be('translation');
      expect(spy.args[0][2]).to.be('missing');
      expect(spy.args[0][3]).to.be('missing');
    });

  });

  describe('to all', function() {
    var server, stub; 

    beforeEach(function(done) {
      server = sinon.fakeServer.create();
      stub = sinon.stub(i18n.functions, "ajax"); 

      server.respondWith([200, { "Content-Type": "text/html", "Content-Length": 2 }, "OK"]);

      i18n.init(i18n.functions.extend(opts, {
        sendMissing: true,
        sendMissingTo: 'all',
        resStore: {
          'en-US': { translation: {  } },
          'en': { translation: {  } },
          'dev': { translation: {  } }
        }
      }), function(t) { done(); } );
    });

    afterEach(function() {
      server.restore();
      stub.restore();
    });

    it('it should post missing resource for all lng to server', function() {
      i18n.t('missing');
      server.respond();
      expect(stub.calledThrice).to.be(true);
    });

  });

});