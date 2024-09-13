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

        /**
         * Initializes the modal window for a given comic.
         *
         * @param {Object} comic - The comic object for which the modal window should be initialized.
         */
        initModal: function(comic) {
            let modalElement = $('#custom-popup-modal-' + comic.id);

            if (modalElement.length) {
                // The modal options
                var options = {
                    type: 'popup',
                    responsive: true,
                    innerScroll: true,
                    modalClass: 'custom-popup-modal',
                    buttons: [{
                        text: $.mage.__('Close'),
                        class: 'button-close',
                        click: function () {
                            modalElement.modal('closeModal');
                        }
                    }]
                };

                var popup = modal(options, modalElement);
                modalElement.modal('openModal');
            } else {
                console.error('Elemento do modal nâo encontrado para o quadrinho com ID:', comic.id);
            }
        },

        /**
         * Marks 10% of the comics as rare.
         *
         * @param {array} comics - Array of comics to be marked as rare.
         */
        markRareComics: function(comics) {
            const totalComics = comics.length;
            const rareCount = Math.floor(totalComics * 0.1); // 10% dos quadrinhos
            const rareIndices = new Set();
            
            // Randomly select 10% of the comics and mark them as rare
            while (rareIndices.size < rareCount) {
                const randomIndex = Math.floor(Math.random() * totalComics);
                rareIndices.add(randomIndex);
            }

            // Set the isRare property of the selected comics to true
            rareIndices.forEach(index => {
                comics[index].isRare = true;
            });
        },

        /**
         * Loads more comics from the Marvel API.
         * 
         * This method loads more comics from the Marvel API and adds them to the
         * comics collection. The comics are marked as rare randomly.
         * 
         * @fires loading
         * @fires loaded
         */
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
