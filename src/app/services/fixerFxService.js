(function() {
  'use strict';

  angular
    .module('geckoboard')
    .service('fixerFxService', FixerFxService);

  FixerFxService.$inject = ['$http', '$q'];
  function FixerFxService($http, $q) {

    return {
      getRate: getRate
    };

    function getRate(from, to) {
      var deferred = $q.defer();
      var promise = $http.get('https://api.fixer.io/latest?base=' + from + '&symbols=' + to);
      promise.then(function(response) {
        deferred.resolve(response.data.rates[to]);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;

    }

  }

})();
