(function() {
  'use strict';

  angular
    .module('geckoboard')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(cryptoService, fixerFxService, $filter, $timeout) {
    var vm = this;
    var audExchangeRate = 0;

    fixerFxService.getRate('USD', 'AUD').then(function(rate) {
      audExchangeRate = rate;
    });

    //May 12, 2017 data
    vm.currencies = {
      BTC: {
        quantity: 1.95639,
        name: 'Bitcoin'
      },
      ETH: {
        quantity: 92.25704,
        name: 'Ethereum'
      },
      XRP: {
        quantity: 52094.54242,
        name: 'Ripple'
      },
      LTC: {
        quantity: 192.30769,
        name: 'Litecoin'
      },
      DASH: {
        quantity: 97.83954,
        name: 'Dash'
      },
      ETC: {
        quantity: 1769.83335,
        name: 'EthereumClassic'
      }
    };

    // //After May 12 transactions
    vm.currencies = {
      BTC: {
        quantity: 4.39939,
        name: 'Bitcoin'
      },
      ETH: {
        quantity: 92.25704,
        name: 'Ethereum'
      },
      XRP: {
        quantity: 52094.54242,
        name: 'Ripple'
      },
      LTC: {
        quantity: 295.08033,
        name: 'Litecoin'
      },
      DASH: {
        quantity: 97.83954,
        name: 'Dash'
      },
      ETC: {
        quantity: 1769.83335,
        name: 'EthereumClassic'
      }
    };

    // vm.currencies.BTC.quantity += 1.40195744;
    // vm.currencies.ETH.quantity += 6.36959781;
    // vm.currencies.ETC.quantity -= (74.49822 + 295.14893570);

    vm.data = {};
    vm.updateSummary = function() {
      cryptoService.getSummary(Object.keys(vm.currencies))
        .then(function(result) {
          result.forEach(function(row) {
            vm.data[row.short] = row;
            vm.data[row.short].value = row.price * vm.currencies[row.short].quantity;
            vm.data[row.short].info = vm.currencies[row.short];
          });

          $timeout(vm.updateSummary, 5000);


        });
    };

    vm.updateSummary();

    vm.sum = function() {
      var total = 0;
      angular.forEach(vm.data, function(data) {
        total += data.value;
      });
      return audExchangeRate * total;
    };

  }
})();
