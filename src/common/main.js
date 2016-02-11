function HSExtension() {
    var self = this;
    self.refresh();
    window.setInterval(function(){self.refresh()}, self._refreshTimeout);
}

HSExtension.prototype = {
    '_refreshTimeout': 30*1000,
    'getServerStatusData': function(){
        var self = this;
        return new Promise(function (resolve, reject) {
            var result = {}, i = 0;
            kango.xhr.send({'url': 'https://www.hse.ru/perl-apache-status?auto', 'method': 'GET', 'async': true, 'contentType': 'text'},
                function(data) {
                    if (data.status == 200 && data.response !== null) {
                        result.perl = self.parseServerStatusData(data.response);
                        if (++i === 2) {
                            resolve(result);
                        }
                    } else {
                        reject('Error when perl request, status=' + data.status);
                    }
                }
            );
            kango.xhr.send({'url': 'https://www.hse.ru/nginx_status', 'method': 'GET', 'async': true, 'contentType': 'text'},
                function(data) {
                    if (data.status == 200 && data.response !== null) {
                        result.nginx = self.parseServerStatusData(data.response);
                        if (++i === 2) {
                            resolve(result);
                        }
                    } else {
                        reject('Error when nginx request, status=' + data.status);
                    }
                }
            );
        });
    },
    'parseServerStatusData': function(data) {
        var hash = {}, match, regexp = /\s*(.+?):\s*(\d+)/g;
        data.split(/\n/)
            .filter(function(o){ return /:/.test(o) })
            .forEach(function(o){
                while (match = regexp.exec(o)) {
                    hash[match[1]] = /^\d+$/.test(match[2]) ? parseInt(match[2], 10) : match[2];
                }
            });
        return hash;
    },
    'refresh': function() {
        var self = this,
            promise = this.getServerStatusData();
        promise.then(
            function(serverData){
                kango.ui.browserButton.setBadgeValue(serverData.perl.BusyServers);
                kango.ui.browserButton.setTooltipText('');

                self[
                    serverData.perl.BusyServers > 50 || serverData.nginx['Active connections'] > 3000 ? 'iconRed' :
                    serverData.perl.BusyServers > 30 || serverData.nginx['Active connections'] > 2000 ? 'iconYellow' :
                    'iconBlue'
                ]();
            },
            function(message){
                self.iconRed();
                kango.ui.browserButton.setBadgeValue('!');
                kango.ui.browserButton.setTooltipText(message);
            });
        return promise;
    },
    'iconRed' : function(){
        kango.ui.browserButton.setIcon('icons/16x16_r.png');
        kango.ui.browserButton.setBadgeBackgroundColor([255, 0, 5, 255]);
    },
    'iconYellow' : function(){
        kango.ui.browserButton.setIcon('icons/16x16_y.png');
        kango.ui.browserButton.setBadgeBackgroundColor([240, 120, 0, 255]);
    },
    'iconBlue' : function(){
        kango.ui.browserButton.setIcon('icons/16x16_b.png');
        kango.ui.browserButton.setBadgeBackgroundColor([2, 20, 255, 100]);
    }
};

var extension = new HSExtension();

function ajaxServerStatus(){
    return extension.refresh();
}
