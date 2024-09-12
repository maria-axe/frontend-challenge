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
        comics: ko.observableArray([]),
        loading: ko.observable(true),
        currentOffset: ko.observable(0),
        limit: 20,

        initialize: function () {
            this._super();
            this.loadMoreComics();
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

        markRareComics: function(comics) {
            const totalComics = comics.length;
            const rareCount = Math.floor(totalComics * 0.1); // 10% dos quadrinhos
            const rareIndices = new Set();
            
            while (rareIndices.size < rareCount) {
                const randomIndex = Math.floor(Math.random() * totalComics);
                rareIndices.add(randomIndex);
            }

            rareIndices.forEach(index => {
                comics[index].isRare = true;
            });
        },

        loadMoreComics: function() {
            const timeStamp = '1726056711';
            const apiKey = '4c27e41d125dff1a975876b76ec7454d';
            const md5 = '222b5bd5511a9c667555a5d00e659418';
            const self = this;
            const offset = self.currentOffset();
            self.loading(true);

            $.ajax({
                url: `https://gateway.marvel.com:443/v1/public/comics?ts=${timeStamp}&apikey=${apiKey}&hash=${md5}&limit=${self.limit}&offset=${offset}`,
                method: 'GET',
                cache: true
            })
            .done(function(response) {
                const newComics = response.data.results;
                self.markRareComics(newComics);
                self.comics(self.comics().concat(newComics));
                self.currentOffset(offset + self.limit);
                self.isVisible(true);
                self.loading(false);
            })
            .fail(function() {
                console.log('error');
            });
        }
    });
});
