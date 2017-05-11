(function() {
  'use strict';

  angular
    .module('geckoboard')
    .service('fxService', FxService);

  FxService.$inject = ['$http', '$q'];
  function FxService($http, $q) {

    return {
      convert: convert,
      getRate: getRate
    };

    function getRate(from, to) {
      return convert(1, from, to);
    }

    function convert(amount, from, to) {
      var deferred = $q.defer();
      var promise = $http.get(
        'https://www.google.com/finance/converter?a=' + amount +
        '&from=' + from +
        '&to=' + to);
      promise.then(function(response) {
        deferred.resolve(response.data.match(/<span class=bld>(.*)<\/span>/)[1].replace(/ AUD/g, ''));
      }, function(error) {
        deferred.reject(error);
      });

      return deferred.promise;

    }
  }

})();
