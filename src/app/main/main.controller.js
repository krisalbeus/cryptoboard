(function() {
  'use strict';

  angular
    .module('geckoboard')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(cryptoService, fixerFxService, krakenService, $filter, $timeout) {
    var vm = this;
    var audExchangeRate = 0;

    fixerFxService.getRate('USD', 'AUD').then(function(rate) {
      audExchangeRate = rate;
    });

    //May 12, 2017 data
    vm.currencies = {
      BTC: {
        quantity: 1.95639,
        name: 'Bitcoin',
        krakenKey: 'BTC'
      },
      ETH: {
        quantity: 92.25704,
        name: 'Ethereum',
        krakenKey: 'ETH'
      },
      XRP: {
        quantity: 52094.54242,
        name: 'Ripple',
        krakenKey: 'XRP'
      },
      LTC: {
        quantity: 192.30769,
        name: 'Litecoin',
        krakenKey: 'LTC'
      },
      DASH: {
        quantity: 97.83954,
        name: 'Dash',
        krakenyKey: 'DASH'
      },
      ETC: {
        quantity: 1769.83335,
        name: 'EthereumClassic',
        krakenKey: 'ETC'
      }
    };

    // //After May 12 transactions
    vm.currencies = {
      BTC: {
        quantity: 4.39939,
        name: 'Bitcoin',
        krakenKey: 'BTC'
      },
      ETH: {
        quantity: 92.25704,
        name: 'Ethereum',
        krakenKey: 'ETH'
      },
      XRP: {
        quantity: 52094.54242,
        name: 'Ripple',
        krakenKey: 'XRP'
      },
      LTC: {
        quantity: 295.08033,
        name: 'Litecoin',
        krakenKey: 'LTC'
      },
      DASH: {
        quantity: 97.83954,
        name: 'Dash',
        krakenKey: 'DASH'
      },
      ETC: {
        quantity: 1769.83335,
        name: 'EthereumClassic',
        krakenKey: 'ETC'
      }
    };

    // vm.currencies.BTC.quantity += 1.40195744;
    // vm.currencies.ETH.quantity += 6.36959781;
    // vm.currencies.ETC.quantity -= (74.49822 + 295.14893570);

    vm.data = {};
    Object.keys(vm.currencies).forEach(function(currency) {
      vm.data[currency] = {};
    });

    vm.updateKraken = function() {
      krakenService.getSummary()
        .then(function(result) {
          Object.keys(result).forEach(function(key) {
            var key2 = (key === 'XBT') ? 'BTC' : key;
            var increased = false;
            if(vm.data[key2].kraken) {
              increased = vm.data[key2].kraken.b[0] < result[key].b[0];
            }
            vm.data[key2].kraken = result[key];
            vm.data[key2].kraken.increased = increased;
            vm.data[key2].value = result[key].b[0] * vm.currencies[key2].quantity;
          });
          $timeout(vm.updateKraken, 5000);
        });
    };

    // vm.updateSummary();
    vm.updateKraken();

    vm.sum = function() {
      var total = 0;
      angular.forEach(vm.data, function(data) {
        total += data.value;
      });
      return audExchangeRate * total;
    };

  }
})();
