define([
    'jquery',
    'underscore',
    'backbone',
    'sysadmin-app/collection/device-settings'
],function($, _, Backbone, DeviceSettingCollection) {
    'use strict';

    var DeviceSettingsView = Backbone.View.extend({

        id: 'admin-device-settings',

        template: _.template($('#device-settings-tmpl').html()),

        initialize: function() {
            this.deviceSettingCollection = new DeviceSettingCollection();
            this.listenTo(this.deviceSettingCollection, 'add', this.addOne);
            this.render();
        },

        render: function() {
            this.$el.html(this.template({'cur_tab': 'settings', 'is_pro': app.pageOptions.is_pro}));
            this.$table = this.$('table');
            this.$tableBody = $('tbody', this.$table);
            this.$loadingTip = this.$('.empty-tips');
        },

        hide: function() {
            this.$el.detach();
        },

        show: function() {
            $("#right-panel").html(this.$el);
            this.showAdminDeviceSettings();
        },

        initPage: function() {
            this.$table.hide();
            this.$tableBody.empty();
        },

        showAdminDeviceSettings: function() {
            this.initPage();

            var _this = this;
            this.deviceSettingCollection.fetch({
                cache: false,
                reset: true,
                success: function(collection, response, opts){
                    collection.each(function(md) {
                        alert(md.get('ipaddress'));
                    })
                },
                error: function(collection, response, opts){
                    var err_msg;
                    if (response.responseText) {
                        if (response['status'] == 401 || response['status'] == 403) {
                            err_msg = gettext("Permission error");
                        } else {
                            err_msg = $.parseJSON(response.responseText).error_msg;
                        }
                    } else {
                        err_msg = gettext("Failed. Please check the network.");
                    }
                    Common.feedback(err_msg, 'error');
                }
            });
        },

        addOne: function(deviceSetting) {
            var view = new DeviceSetting({model: deviceSetting});
            this.$tableBody.append(view.render().el);
        }
    });

    return DeviceSettingsView;
});
