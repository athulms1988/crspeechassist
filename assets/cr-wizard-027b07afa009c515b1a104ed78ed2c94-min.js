require(["jquery","uitk","uitk_localized_dateApi"],function(b,f,B){function r(a,d){for(var c=0;c<e.length;c++)Number(e[c].gaiaId)===Number(d)&&("AIRPORT"===e[c].type?a.val(e[c].hierarchyInfo.airport.airportCode):a.val(e[c].coordinates.lat+","+e[c].coordinates["long"]),"pickup_location"===a.attr("name")&&("TRAINSTATION"===e[c].type?b("#stationTypeTrain").attr("name","stationTypeTrain").val(!0):b("#stationTypeTrain").attr("name","").val(""),b("#searchGaiaId").val(e[c].gaiaId)),b("#drop-off-checkbox").is(":checked")||(b('input[name\x3d"dropoff_location"]').val(a.val()),b('input[name\x3d"dropoff_location_name"]').val(b('input[name\x3d"pickup_location_name"]').val())))}function t(){b(".noDestinationMsg").addClass("hidden")}function m(){var a=b("#startDateInput").val();a&&(a=f.utils.createLocalizedDateTime(u(a),b("#pu-time-select").val(),window.uitk.locale),a=v(a.date,a.time),b('input[name\x3d"pickup_datetime"]').val(a));if(a=b("#endDateInput").val())a=f.utils.createLocalizedDateTime(u(a),b("#do-time-select").val(),window.uitk.locale),a=v(a.date,a.time),b('input[name\x3d"dropoff_datetime"]').val(a)}function u(a){for(var b="",c=0;c<a.length;c++)127>a.charCodeAt(c)&&(b+=a.charAt(c));return b}function v(a,b){if(!a||"object"!==typeof a)return console.error("Invalid date format"),"";var c=b&&""!==b?b:"00:00";return String(a.getFullYear()).concat("-"+("0"+(a.getMonth()+1)).slice(-2)).concat("-"+("0"+a.getDate()).slice(-2)).concat("T"+("0"+c.substr(0,2)).slice(-2)).concat(":"+("0"+c.substr(3,2)).slice(-2)).concat(":00Z")}function y(a,b){void 0===b&&(b=decodeURIComponent);if("string"!==typeof a||!a)return null;var c=(new RegExp("(?:^|; )"+a.replace(/[.*+?^$|[\](){}\\-]/g,"\\$\x26")+"(?:\x3d([^;]*))?(?:;|$)")).exec(document.cookie);return null===c?null:"function"===typeof b?b(c[1]):c[1]}function z(a,b,c){0>b.indexOf(window.location.hostname)&&(0===a.children('input[name\x3d"'+b+'"]').length?a.prepend('\x3cinput type\x3d"hidden" name\x3d"'+b+'" value\x3d"'+c+'"\x3e'):a.children('input[name\x3d"'+b+'"]').each(function(a,b){b.setAttribute("value",c);b.removeAttribute("disabled")}))}function k(a){return 1===a.length&&""!==a.val()}var p=function(a){return(a=(new RegExp("[?\x26]"+a+"\x3d([^\x26]*)")).exec(window.location.search))&&decodeURIComponent(a[1].replace(/\+/g," "))},e=[];f.subscribe("typeahead.resultSelected",function(a,d){if(!0===window.optimizelyAddressCheck){var c=Number(d.element[0].id.match(/aria-option-(\d*)/)[1]);var g=b('input[name\x3d"pickup_location"]');d.element.prevObject.hasClass("dropoff")&&(g=b('input[name\x3d"dropoff_location"]'));"AIRPORT"===e[c].type?g.val(e[c].hierarchyInfo.airport.airportCode):g.val(e[c].coordinates.lat+","+e[c].coordinates["long"]);"pickup_location"===g.attr("name")&&("TRAINSTATION"===e[c].type?b("#stationTypeTrain").attr("name","stationTypeTrain").val(!0):b("#stationTypeTrain").attr("name","").val(""),b("#searchGaiaId").val(e[c].gaiaId));b("#drop-off-checkbox").is(":checked")||(b('input[name\x3d"dropoff_location"]').val(g.val()),b('input[name\x3d"dropoff_location_name"]').val(b('input[name\x3d"pickup_location_name"]').val()))}else c=b(d.element).data("id"),g=b('input[name\x3d"pickup_location"]'),c===b("input#dropoff_location").data("id")&&(g=b('input[name\x3d"dropoff_location"]')),r(g,c);t()});b("body").on("change","#pickup_location, #dropoff_location",function(a){e[0]&&e[0].gaiaId&&(b(a.target).val(e[0].regionNames.fullName),r(b('input[name\x3d"'+a.target.id+'"]'),e[0].gaiaId))});b("body").on("change","#drop-off-checkbox",function(){b("#drop-off-checkbox").is(":checked")||""===b('input[name\x3d"pickup_location"]').val()||(b('input[name\x3d"dropoff_location"]').val(b('input[name\x3d"pickup_location"]').val()),b('input[name\x3d"dropoff_location_name"]').val(b('input[name\x3d"pickup_location_name"]').val()))});f.subscribe("typeahead.opened",function(a,b){e=b.results;t()});f.subscribe("typeahead.closed",function(){var a=b(".noDestinationMsg--pickup"),d=b(".noDestinationMsg--dropoff"),c=b("#pickup_location"),g=b("#dropoff_location");c.is(":focus")&&1<c.val().length&&0>c.val().indexOf(",")&&a.removeClass("hidden");g.is(":focus")&&1<g.val().length&&0>g.val().indexOf(",")&&b("#drop-off-checkbox").is(":checked")&&d.removeClass("hidden");b("#drop-off-checkbox").is(":checked")||(b('input[name\x3d"dropoff_location_name"]').val(b('input[name\x3d"pickup_location_name"]').val()),d.removeClass("hidden"))});b(document).on("change","#pu-time-select, #do-time-select",function(){m()});b(document).on("click","#pickup_location, #dropoff_location",function(a){(1<b("#pickup_location").val().length||1<b("#dropoff_location").val().length)&&b(a.target).trigger("keyup")});f.subscribe("datepicker.selectDate",function(a,d){b(d.element).is("#startDateInput")&&setTimeout(function(){b("#endDateInput").click()},10);setTimeout(function(){m()},10)});var q=function(a,d,c){a.match(/^\d+$/)?b.get("https://geo.carrentals.com/api/v1/fr-fr/features/"+a+"?verbose\x3d3\x26geoVersion\x3d3",function(a){h(d,a);c&&h(c,a)}):a.match(/^[a-zA-Z]{3}$/)&&b.get("https://geo.carrentals.com/api/v1/fr-fr/iata/"+a+"/?verbose\x3d3\x26geoVersion\x3d3",function(a){h(d,a);c&&h(c,a)})},h=function(a,d){if("airport"===d.type){b("#"+a).val(d.name);try{b('input[name\x3d"'+a+'"]').val(d.tags.iata.airportCode.value)}catch(c){b('input[name\x3d"'+a+'"]').val(p(a))}}else b("#"+a).val(d.name),b('input[name\x3d"'+a+'"]').val(d.position.coordinates[1]+","+d.position.coordinates[0])},w=function(a){return/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:.\d{0,3})?Z/.exec(a)},x=function(a){a=a.replace("T"," ").replace("Z","");return new Date(a)<Date.now()};(function(){try{var a=JSON.parse(y("pdlVisitor"));if(a&&a.search&&a.search.dropoff_date&&a.search.dropoff_destination&&a.search.dropoff_destination.id&&a.search.dropoff_destination.name&&a.search.pickup_date&&a.search.pickup_destination&&a.search.pickup_destination.id&&a.search.pickup_destination.name){var d=b('input[name\x3d"pickup_location"]');""===d.val()&&(d.val(a.search.pickup_destination.id),b('input[name\x3d"pickup_location_name"]').val(a.search.pickup_destination.name),b('input[name\x3d"dropoff_location"]').val(a.search.dropoff_destination.id),b('input[name\x3d"dropoff_location_name"]').val(a.search.dropoff_destination.name),a.search.pickup_destination.id!==a.search.dropoff_destination.id&&b("#drop-off-checkbox").prop("checked",!0),b("#searchGaiaId").val(a.search.pickup_destination.searchGaiaId||""));var c=w(a.search.pickup_date)&&w(a.search.dropoff_date),e=!x(a.search.dropoff_date)&&!x(a.search.pickup_date);if(c&&e){b('input[name\x3d"pickup_datetime"]').val(a.search.pickup_date);var k=a.search.pickup_date.split("T")[0],A=f.utils.createLocalizedISODate(k,f.locale);b("#startDateInput").val(A.shortDate({pad:!0}));var l=a.search.pickup_date.split("T")[1];l=l.substring(0,l.length-4);0<b('#pu-time-select \x3e option[value\x3d"'+l+'"]').length&&b("#pu-time-select").val(l);b('input[name\x3d"dropoff_datetime"]').val(a.search.dropoff_date);var h=a.search.dropoff_date.split("T")[0],m=f.utils.createLocalizedISODate(h,f.locale);b("#endDateInput").val(m.shortDate({pad:!0}));var n=a.search.dropoff_date.split("T")[1];n=n.substring(0,n.length-4);0<b('#do-time-select \x3e option[value\x3d"'+n+'"]').length&&b("#do-time-select").val(n)}}}catch(C){}})();(function(){var a=p("pickup_location"),d=p("dropoff_location");a&&d?(q(a,"pickup_location"),q(d,"dropoff_location"),b("#drop-off-checkbox").prop("checked",!0)):a&&q(a,"pickup_location","dropoff_location");try{var c=window.location.href.slice(window.location.href.indexOf("?")+1).split("\x26");for(a=0;a<c.length;a++){var e=c[a].split("\x3d");var f=e[0],h=e[1];""!==h&&void 0!==h&&z(b(".farefinder-form"),f,h)}}catch(l){}e=b('.farefinder-form input[name*\x3d"coupons["]');k(e)&&b("#cr-coupon-area").show()})();(function(){if(""===b("#startDateInput").val()){var a={year:"numeric",month:"numeric",day:"2-digit"},d=new Date;d.setDate(d.getDate()+7);b("#startDateInput").val(d.toLocaleDateString(f.locale.replace(/_/g,"-"),a));d.setDate(d.getDate()+
3);b("#endDateInput").val(d.toLocaleDateString(f.locale.replace(/_/g,"-"),a));m()}b(".input-wrapper .btn-clear").filter(function(){return""!==b(this).parent().find("input").val()}).removeAttr("disabled")})();(function(){var a=b(".noDestinationMsg"),d=b("#pickup_location"),c=b("#dropoff_location");d.on("focusout",function(){a.addClass("hidden")});c.on("focusout",function(){a.addClass("hidden")})})();(function(){var a=b('.farefinder-form input[name*\x3d"coupons["]');k(a)&&(b("#promotion-code").val(a.val()),b("#cr-coupon-area").show());b("#promotion-code").on("change",function(){a.val(b("#promotion-code").val())})})();(function(){var a=b('.farefinder-form input[name\x3d"driverAge"]');a.length&&"undefined"!==a.val()&&b("#drivers-age").val(a.val());b("#drivers-age").on("change",function(){a.val(b("#drivers-age").val());""===a.val()?a.prop("disabled",!0):a.prop("disabled",!1)})})();(function(){var a=b('.farefinder-form input[name*\x3d"coupons["]'),d=b("#supplier-selectbox"),c=null;k(a)&&(c=decodeURIComponent(a.attr("name")),a.attr("name",c),(c=c.match(/\[(.*?)\]/))&&""!==c[1]&&d&&(c=c[1].toUpperCase(),d.val(c)));d.on("change",function(){a.attr("name","coupons["+d.val()+"][]")})})();(function(){var a=b('.farefinder-form input[name*\x3d"coupons["]');k(a)?b(".cr-wizard .toggle-trigger").addClass("toggle-trigger--display"):b(".toggle-trigger--display").removeClass("toggle-trigger--display")})();(function(){var a=window.location.origin.match(/dev|mahi/);if(a){var d=b(".farefinder-form");d.attr("action",d.attr("action").replace("book","book-"+a[0]))}})();(function(){if(window.OptimizelyPromoFields&&window.OptimizelyPromoFields.promoCode&&window.OptimizelyPromoFields.promoSupplier){var a=window.OptimizelyPromoFields.promoSupplier;b("#optCoupons").attr("name","coupons["+a+"][]");b("#optCoupons").val(window.OptimizelyPromoFields.promoCode);b("#promoType").attr("name","promo_type");b("#promoType").val(window.OptimizelyPromoFields.promoType||1)}window.recommendCarFlag&&b("#recommendedCar").attr("name","recommendedCar").val("true")})()});
//# sourceMappingURL=cr-wizard.js.map