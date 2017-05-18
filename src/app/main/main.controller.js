(function() {
  'use strict';

  angular
    .module('geckoboard')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(cryptoService, fixerFxService, krakenService, $filter, $timeout) {
    var vm = this;
    var audExchangeRate = 1.35;
    var deposit = 60000;
    
    vm.sum = 0;

    fixerFxService.getRate('USD', 'AUD').then(function(rate) {
      audExchangeRate = rate;
    });

    // //After May 12 transactions
    vm.currencies = {
      BTC: {
        quantity: 4.39939,
        name: 'Bitcoin',
        krakenKey: 'BTC',
        fractionSize: 2
      },
      ETH: {
        quantity: 92.25704,
        name: 'Ethereum',
        krakenKey: 'ETH',
        fractionSize: 2
      },
      XRP: {
        quantity: 52094.54242,
        name: 'Ripple',
        krakenKey: 'XRP',
        fractionSize: 4
      },
      LTC: {
        quantity: 295.08033,
        name: 'Litecoin',
        krakenKey: 'LTC',
        fractionSize: 2
      },
      DASH: {
        quantity: 97.83954,
        name: 'Dash',
        krakenKey: 'DASH',
        fractionSize: 2
      },
      ETC: {
        quantity: 1769.83335,
        name: 'EthereumClassic',
        krakenKey: 'ETC',
        fractionSize: 2
      },
      XLM: {
        quantity: 0,
        name: 'StellarLumens',
        krakenKey: 'XLM',
        fractionSize: 4
      }
    };

    // vm.currencies.BTC.quantity += 1.40195744;
    // vm.currencies.ETH.quantity += 6.36959781;
    // vm.currencies.ETC.quantity -= (74.49822 + 295.14893570);

    vm.data = {};
    Object.keys(vm.currencies).forEach(function(currency) {
      vm.data[currency] = {};
    });

    vm.updateSummary = function() {
      cryptoService.getSummary(Object.keys(vm.currencies))
        .then(function(result) {
          result.forEach(function(row) {
            vm.data[row.short].coincap = row;
          });
          $timeout(vm.updateSummary, 10000);
        });
    };

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
            vm.data[key2].value = result[key].b[0] * vm.currencies[key2].quantity * audExchangeRate;
          });
          vm.computeTotal();
          $timeout(vm.updateKraken, 5000);
        });
    };

    vm.updateSummary();
    vm.updateKraken();

    vm.computeTotal = function() {
      var total = 0;
      angular.forEach(vm.data, function(data) {
        total += data.value;
      });
      vm.sum = total - deposit;
    };

  }
})();
