/**
 * Copyright ©  Infobase. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'ko',
    'uiComponent',
    'jquery'
], function (ko, Component, $) {
    'use strict';

    return Component.extend({
        isVisible: ko.observable(true),
        comics: ko.observable(''),
        comicName: ko.observable(''),

        initialize: function () {
            this._super();
            this.mavelComics();
        },

        mavelComics: function() {
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
                console.log(response);
            })
            .fail(function() {
                console.log('error');
            });
        }            
    });
});
