var analyticsTracking = (function () {
    "use strict";
    function analyticsTracking() {

    }

    analyticsTracking.prototype.getFullListName = function (listing) {
        var localDocument = document;
        var localWindow = window;
        return this.getFullListNamePrivate(listing, localDocument, localWindow);
    }

    analyticsTracking.prototype.getFullListNamePrivate = function (listing, localDocument, localWindow) {
        var isOnProductPage = localDocument.URL.indexOf("/product/") !== -1;
        if (isOnProductPage) {
            var productPageListing = "Product | " + listing;
            return productPageListing;
        }

        var listName = "";
        var path = localWindow.location.pathname.split("/");
        for (var x = 1; x < path.length; x++) {

            var pathSection = path[x];
            var isOnHomepage = pathSection.length === 0;
            if (isOnHomepage) {
                pathSection = "Homepage";
            } else {
                pathSection = pathSection.charAt(0).toUpperCase() + pathSection.slice(1);
            }

            listName += pathSection + " | ";
        }

        listName += listing;

        return listName;
    }

    analyticsTracking.prototype.googleAnalyticsEvent = function (typeOfAction, action, eventName, actionString) {
        if (actionString === null) {
            safeGa("send", "event", typeOfAction, action, eventName);
        } else {
            safeGa("send", "event", typeOfAction, action, eventName, actionString);
        }
    }

    analyticsTracking.prototype.googleAnalyticsPromotion = function (promotionId, promotionName, position) {
        safeGa("ec:addPromo", { 'id': promotionId, 'name': promotionName, 'position': position });
    }

    analyticsTracking.prototype.googleAnalyticsSetAction = function (action, actionString) {
        if (actionString === null) {
            safeGa("ec:setAction", action);
        } else {
            safeGa("ec:setAction", action, actionString);
        }
    }

    analyticsTracking.prototype.googleAnalyticsAddProduct = function (productId, productName, productQty, productCategory, productbrand, productPosition, productPrice) {
        var obj = {
            'id': productId,
            'name': productName
        }

        if (productCategory) obj.category = productCategory;
        if (productQty) obj.quantity = productQty;
        if (productbrand) obj.brand = productbrand;
        if (productPosition) obj.position = productPosition;
        if (productPrice) obj.price = productPrice;

        safeGa("ec:addProduct", obj);
    }

    analyticsTracking.prototype.googleAnalyticsAddImpression = function (productId, productName, listName, productPosition) {
        safeGa("ec:addImpression", {
            "id": productId,
            "name": productName,
            "list": listName,
            "position": productPosition
        });
    }

    analyticsTracking.prototype.googleAnalyticsPageview = function () {
        safeGa("send", "pageview");
    }

    analyticsTracking.prototype.facebookViewContent = function (products) {
        safeFbq("track", "ViewContent", {
            'content_ids': products,
            'content_type': "product"
        });
    }

    analyticsTracking.prototype.facebookAddProduct = function (product) {
        safeFbq("track", "AddToCart", {
            'content_ids': product,
            'content_type': "product"
        });
    }

    function safeFbq(fbqParamOne, fbqParamTwo, fbqContentObject) {
        if (window.fbq === undefined) {
            console.log("FBQ Not defined");
        } else {
            fbq(fbqParamOne, fbqParamTwo, fbqContentObject);
        }
    };

    function safeGa(gaParamOne, gaParamTwo, typeOfAction, action, eventName) {
        if (window.ga !== undefined) {
            if (eventName !== undefined) { ga(gaParamOne, gaParamTwo, typeOfAction, action, eventName); }
            else if (typeOfAction !== undefined) { ga(gaParamOne, gaParamTwo, typeOfAction); }
            else if (gaParamTwo !== undefined) { ga(gaParamOne, gaParamTwo); }
        } else {
            console.log("GA Not defined");
        }
    };

    return analyticsTracking;
})();