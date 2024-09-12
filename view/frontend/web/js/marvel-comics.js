/**
 * Copyright ©  Infobase. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'ko',
    'uiComponent',
    'jquery',
    'Magento_Ui/js/modal/modal'
], function (ko, Component, $, modal) {
    'use strict';

    return Component.extend({
        isVisible: ko.observable(false),
        comics: ko.observable([]),

        initialize: function () {
            this._super();
            this.marvelComics();
        },

        initModal: function(comic) {
            let modalElement = $('#custom-popup-modal-' + comic.id);

            if (modalElement.length) {
                var options = {
                    type: 'popup',
                    responsive: true,
                    innerScroll: true,
                    modalClass: 'custom-popup-modal',
                    buttons: [{
                        text: $.mage.__('Close'),
                        class: '',
                        click: function () {
                            modalElement.modal('closeModal');
                        }
                    }]
                };

                var popup = modal(options, modalElement);
                modalElement.modal('openModal');
            } else {
                console.error('Elemento do modal não encontrado para o quadrinho com ID:', comic.id);
            }
        },

        marvelComics: function() {
            const timeStamp = '1726056711';
            const apiKey = '4c27e41d125dff1a975876b76ec7454d';
            const md5 = '222b5bd5511a9c667555a5d00e659418';

            const self = this;

            $.ajax({
                url: `https://gateway.marvel.com:443/v1/public/comics?ts=${timeStamp}&apikey=${apiKey}&hash=${md5}&limit=10`,
                method: 'GET',
                cache: true
            })
            .done(function(response) {
                self.comics(response.data.results);
                self.isVisible(true);
            })
            .fail(function() {
                console.log('error');
            });
        }
    });
});
