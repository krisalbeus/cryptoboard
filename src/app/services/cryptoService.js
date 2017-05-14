(function() {
  'use strict';

  angular
    .module('geckoboard')
    .service('cryptoService', CryptoService);

  CryptoService.$inject = ['$http', '$q'];
  function CryptoService($http, $q) {

  	return {
  		getHistory: getHistory,
      getSummary: getSummary
  	}

  	function getHistory(currency) {
  		return $http.get('https://www.coincap.io/history/1day/' + currency);
  	}

    function getSummary(currencies) {
      var deferred = $q.defer();
      var promise = $http.get('https://www.coincap.io/front');
      promise.then(function(response) {
        var data = response.data.filter(function(row) {
          return currencies.indexOf(row.short) >= 0;
        }).map(function(row) {
          row.increased = parseFloat(row.cap24hrChangePercent) > 0;
          row.rate = Math.abs(row.cap24hrChangePercent);
          return row;
        });
        deferred.resolve(data);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }
  }

})();
