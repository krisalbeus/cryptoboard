
(function() {
  'use strict';

  angular
    .module('geckoboard')
    .service('krakenService', KrakenService);

  KrakenService.$inject = ['$http', '$q'];

  function KrakenService($http, $q) {


    return {
      getSummary: getSummary
    }

    function getSummary() {
      var deferred = $q.defer();
      var promise = $http.get('https://api.kraken.com/0/public/Ticker?pair=DASHUSD,XBTUSD,ETHUSD,ETCUSD,LTCUSD,XRPXBT,XLMUSD');

      promise.then(function(response) {

        var nonUsd = [];
        var finalData = {};

        Object.keys(response.data.result).forEach(function(key) {
          var newKey;
          if(key.indexOf('X') === 0) {
            newKey = key.substring(1,4);
          } else {
            newKey = key.substring(0,4);
          }

          if(key.indexOf('USD') < 0) {
            nonUsd.push({key: key, newKey: newKey});
          }

          finalData[newKey] = response.data.result[key];
        });

        nonUsd.forEach(function(non) {
          var otherKey = non.key.substring(4) + 'ZUSD';
          finalData[non.newKey].a[0] = (parseFloat(response.data.result[non.key].a[0])
            * parseFloat(response.data.result[otherKey].b[0])).toString();
          finalData[non.newKey].b[0] = (parseFloat(response.data.result[non.key].b[0])
            * parseFloat(response.data.result[otherKey].a[0])).toString();
        });

        deferred.resolve(finalData);
      }, function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }


  }

}());
