
describe("When tracking,", function () {

    var sut;
    var id = "612007";
    var productIds = [612007, 562717];
    var name = "Badger Gun";
    var listName = "Product | Recommendations";
    var productQuantity = "1";
    var position = "1";
    var productPrice = "200";
    var category = "657";
    var brand = "Badger Ordnance";
    var action = "detail";
    var typeEvent = "UX";
    var eventAction = "click";
    var stringAction = {'step': window.googleCheckoutStep};
    var actionName = "add to cart";

    beforeEach(function () {
        var analyticsTrack = new analyticsTracking();
        sut = analyticsTrack;
        //spyOn(console, 'log').and.callThrough();
        spyOn(console, 'log');
    });

    describe("and GA and FBQ are not define", function() {
        describe("with Goole Analytics", function () {

            it("should call console.log with GA Not defined.", function () {
                sut.googleAnalyticsAddProduct(id, name, null, category, brand);
                expect(console.log).toHaveBeenCalledWith("GA Not defined");
            });
           
            it("should call Ga Set Action", function () {
                sut.googleAnalyticsSetAction(action, null);
                expect(console.log).toHaveBeenCalledWith("GA Not defined");
            });
          
            it("should call Ga Event", function () {
                sut.googleAnalyticsEvent(typeEvent, eventAction, actionName);
                expect(console.log).toHaveBeenCalledWith("GA Not defined");
            });

            it("should call Ga Pageview", function () {
                sut.googleAnalyticsPageview();
                expect(console.log).toHaveBeenCalledWith("GA Not defined");
            });

            it("should call GA Add Impression", function () {
                sut.googleAnalyticsAddImpression(id, name, listName, position);
                expect(console.log).toHaveBeenCalledWith("GA Not defined");
            });
        });
        describe("with Facebook ", function () {
            it("should call fbq View Content", function () {
                sut.facebookViewContent(id);
                expect(console.log).toHaveBeenCalledWith("FBQ Not defined");
            });
            it("should call fbq Add To Cart", function () {
                sut.facebookAddProduct(id);
                expect(console.log).toHaveBeenCalledWith("FBQ Not defined");
            });
        });
    });
    describe("When GA and FBQ are define", function () {

        beforeEach(function() {
            ga = jasmine.createSpy();
            fbq = jasmine.createSpy();
        });

        describe("a product list", function () {
            var localDocument;
            var localWindow;
            beforeEach(function () {
                localDocument = { URL: "gfsegesg" };
            });

            describe("and its on a product page", function () {
                beforeEach(function () {
                    localDocument = { URL: "gfsegesg/product/" };
                });
                it("should return Product | Recommendations", function () {
                    expect(sut.getFullListNamePrivate('Recommendations', localDocument, localWindow)).toBe('Product | Recommendations');
                });
            });

            describe("and its on a Home Page", function () {
                beforeEach(function () {
                    localWindow = { location: { pathname: "/" } };
                });
                it("should return Home | Recommendations", function () {
                    expect(sut.getFullListNamePrivate('Recommendations', localDocument, localWindow)).toBe('Homepage | Recommendations');
                });
            });
            describe("and its on a Sale Page", function () {
                beforeEach(function () {
                    localWindow = { location: { pathname: "/sale" } };
                });
                it("should return Sale | Recommendations", function () {
                    expect(sut.getFullListNamePrivate('Recommendations', localDocument, localWindow)).toBeDefined();
                });
            });

        });
        describe("with Goole Analytics", function () {

            it("should call Ga Add Product with Category and Brand", function () {
                sut.googleAnalyticsAddProduct(id, name, null, category, brand);
                expect(ga).toHaveBeenCalledWith("ec:addProduct", { "id": id, "name": name, "category": category, "brand": brand });
                expect(ga.calls.count()).toBe(1);
            });

            it("should call Ga Add Product with Position", function () {
                sut.googleAnalyticsAddProduct(id, name, null, null, null, position);
                expect(ga).toHaveBeenCalledWith("ec:addProduct", { "id": id, "name": name, "position": position });
                expect(ga.calls.count()).toBe(1); 
            });

            it("should call Ga Add Product with Quantity", function () {
                sut.googleAnalyticsAddProduct(id, name, productQuantity);
                expect(ga).toHaveBeenCalledWith("ec:addProduct", { "id": id, "name": name, "quantity": productQuantity });
                expect(ga.calls.count()).toBe(1);
            });

            it("should call Ga Add Product with Price and Quantity", function () {
                sut.googleAnalyticsAddProduct(id, name, productQuantity, null, null, null, productPrice);
                expect(ga).toHaveBeenCalledWith("ec:addProduct", { "id": id, "name": name, "price": productPrice, "quantity": productQuantity });
                expect(ga.calls.count()).toBe(1);
            });

            it("should call Ga Set Action", function () {
                sut.googleAnalyticsSetAction(action, null);
                expect(ga).toHaveBeenCalledWith("ec:setAction", action);
                expect(ga.calls.count()).toBe(1);
            });

            it("should call Ga Set Action with a actionString", function () {
                sut.googleAnalyticsSetAction(action, stringAction);
                expect(ga).toHaveBeenCalledWith("ec:setAction", action, stringAction);
                expect(ga.calls.count()).toBe(1);
            });

            it("should call Ga Event", function () {
                sut.googleAnalyticsEvent(typeEvent, eventAction, actionName);
                expect(ga).toHaveBeenCalledWith("send", "event", typeEvent, eventAction, actionName);
                expect(ga.calls.count()).toBe(1);
            });

            it("should call Ga Pageview", function () {
                sut.googleAnalyticsPageview();
                expect(ga).toHaveBeenCalledWith("send", "pageview");
                expect(ga.calls.count()).toBe(1);
            });

            it("should call GA Add Impression", function () {
                sut.googleAnalyticsAddImpression(id, name, listName, position);
                expect(ga).toHaveBeenCalledWith("ec:addImpression", { "id": id, "name": name, "list": listName, "position": position });
                expect(ga.calls.count()).toBe(1);
            });
        });
        describe("with Facebook ", function () {
            it("should call fbq View Content for single product", function () {
                sut.facebookViewContent(id);
                expect(fbq).toHaveBeenCalledWith("track", "ViewContent", { 'content_ids': id, 'content_type': "product" });
                expect(fbq.calls.count()).toBe(1);
            });

            it("should call fbq View Content with Multi products", function () {
                sut.facebookViewContent(productIds);
                expect(fbq).toHaveBeenCalledWith("track", "ViewContent", { 'content_ids': productIds, 'content_type': "product" });
                expect(fbq.calls.count()).toBe(1);
            });

            it("should call fbq Add To Cart", function () {
                sut.facebookAddProduct(id);
                expect(fbq).toHaveBeenCalledWith("track", "AddToCart", { 'content_ids': id, 'content_type': "product" });
                expect(fbq.calls.count()).toBe(1);
            });
        });
    });

});

