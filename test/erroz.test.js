"use strict";

var chai = require("chai"),
    expect = chai.expect;

var erroz = require("../lib/");

function stringifyAndParse(obj) {
    return JSON.parse(JSON.stringify(obj));
}

describe("erroz", function () {

    var CustomError,
        errProperties,
        err;

    beforeEach(function () {

        errProperties = {
            goodError: true,
            badError: false,
            status: "fail",
            statusCode: 418,
            message: "I'm a teapot"
        };

        CustomError = new erroz(errProperties);
        err = new CustomError();
    });

    describe("Attributes", function () {

        it("should expose all attributes", function () {
            expect(err).to.include.keys(Object.keys(errProperties));
        });

        it("should be able to modify attributes via instance", function() {

            var obj;
            err = new CustomError();

            err.statusCode = 200;

            obj = stringifyAndParse(err);

            expect(err.statusCode).to.eql(200);
            expect(obj.statusCode).to.eql(200);
        });

        it("should be able to modify attributes via prototype", function() {
            var obj;

            CustomError.prototype.statusCode = 404;

            err = new CustomError();

            obj = stringifyAndParse(err);

            expect(err.statusCode).to.eql(404);
            expect(obj.statusCode).to.eql(404);
        });

    });

    describe("template rendering", function() {

        it("should use message if defined", function() {

            var error = {
                message: "blub",
                template: "yeha"
            },
                CustomError = erroz(error);

            err = new CustomError();

            expect(err.message).to.eql(error.message);
        });

        it("should use template if defined and render with data", function() {

            var error = {
                    template: "yeha %fur"
                },
                CustomError = erroz(error);

            err = new CustomError({
                fur: "fluffy"
            });

            expect(err.message).to.eql("yeha fluffy");
        });

        it("should use template if defined and accept data to be undefined", function() {

            var error = {
                    template: "yeha %fur"
                },
                CustomError = erroz(error);

            err = new CustomError();

            expect(err.message).to.eql("yeha undefined");
        });

        it("should not throw if neither template nor message are defined", function() {
            var error = {
                    code: "too-fluffy"
                },
                CustomError = erroz(error);

            err = new CustomError();

            expect(err.code).to.eql(error.code);
        });
    });

    describe("#toJSON", function () {

        it("should contain all custom properties", function () {

            var err = new CustomError(),
                errObj = stringifyAndParse(err);

            expect(errObj).to.include.keys(Object.keys(errProperties));
        });

    });

    describe("#toJSend", function() {

        it("should expose only JSend compatible keys", function() {
            expect(err.toJSend()).to.have.keys(["status", "message", "code", "data"]);
        });

    });
});