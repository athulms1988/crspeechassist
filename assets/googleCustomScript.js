setTimeout(function() {
  if(Bootstrapper) { 
    /* Rule Id: 3043345 */
    Bootstrapper.insertScript('https://www.googletagmanager.com/gtag/js?id=AW-1041029302');
    window.dataLayer = window.dataLayer || [];
  
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'AW-1041029302');
  
  
  
  
    /* Rule Id: 3045628 */
    Bootstrapper.data.resolve(['55626'], function(manage_55626) {
      var ensVar0 = function() {
        return manage_55626
      };
  
  
      var type = 'global',
        custom_conversion_id = '',
        custom_conversion_label = '',
        custom_event_name = ''
      local_params = {};
  
      if (type === 'async') {
        Bootstrapper.loadScriptCallback('//www.googleadservices.com/pagead/conversion_async.js', function() {
          window.google_trackConversion({
            'google_conversion_id': custom_conversion_id,
            'google_conversion_label': custom_conversion_label,
            'google_remarketing_only': true,
            'google_custom_params': local_params
          });
        });
  
      } else if (type === 'sync') {
        window.google_conversion_id = custom_conversion_id;
        window.google_conversion_label = custom_conversion_label;
        window.google_remarketing_only = true;
        window.google_custom_params = local_params;
  
        document.write('<script src="//www.googleadservices.com/pagead/conversion.js"></script>');
      } else if (type === 'image') {
        var data = [],
          dataParam = '';
        for (var i in local_params) {
          if (local_params.hasOwnProperty(i)) {
            data.push(encodeURIComponent(i + '=' + local_params[i]));
          }
        }
  
        dataParam = data.length > 0 ? ('&data=' + data.join(';')) : '';
        new Image().src = 'https://googleads.g.doubleclick.net/pagead/viewthroughconversion/' + custom_conversion_id + '/?value=0&label=' + custom_conversion_label + '&guid=ON&script=0' + dataParam;
      } else if (type === 'global') {
        var dl = '';
        if (dl == '') {
          dl = 'dataLayer';
        }
        window[dl] = window[dl] || [];
  
        var remarketingIds = [];
        remarketingIds.push(ensVar0.call(this));
  
        var url = '//www.googletagmanager.com/gtag/js?id=' + remarketingIds[0] + (dl !== "dataLayer" ? "&l=" + dl : "");
  
        function callbackFunc() {
          for (var i = 0; i < remarketingIds.length; i++) {
            gtag('config', remarketingIds[i]);
          }
          if (custom_conversion_label) {
            var send_to_list = [];
            for (var i = 0; i < remarketingIds.length; i++) {
              var tracking_id = remarketingIds[i] + '/' + '';
              send_to_list.push(tracking_id);
            }
            local_params.send_to = send_to_list;
          }
  
          custom_event_name = custom_event_name ? custom_event_name : 'conversion';
          gtag('event', custom_event_name, local_params);
        }
        if (!window.gtag) {
          window.gtag = window.gtag || function gtag() {
            window[dl].push(arguments);
          };
          gtag('js', new Date());
          Bootstrapper.loadScriptCallback(url, callbackFunc);
        } else {
          callbackFunc();
        }
      }
  
      var host = window.location.hostname.split('.');
  
      if (host[0].includes('book')) {
        switch (host[1]) {
          case 'autoescape':
            break;
  
          case 'cardelmar':
            break;
  
          case 'carrentals':
            gtag('config', 'UA-19001464-6');
            break;
        }
      }
    })
  }  
}, 6000);
