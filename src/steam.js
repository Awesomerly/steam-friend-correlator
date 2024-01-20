"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSummaries = exports.getFriends = exports.resolveVanity = void 0;
var steamid_1 = require("steamid");
var error_js_1 = require("./error.js");
require("dotenv/config");
var key = process.env.STEAMAPI_KEY;
var apiUrl = "http://api.steampowered.com/ISteamUser";
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
function parseSteamId(id) {
    var createdId = new steamid_1.default(id);
    if (createdId.isValidIndividual() === false) {
        throw new error_js_1.ValidationError(400, "Invalid Steam ID");
    }
    return createdId.getSteamID64();
}
// TODO: add proper error stuff to this
function resolveVanity(vanity) {
    return __awaiter(this, void 0, void 0, function () {
        var url, resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = new URL(apiUrl + "/ResolveVanityURL/v0001/");
                    url.searchParams.append("key", key);
                    url.searchParams.append("vanityurl", vanity);
                    return [4 /*yield*/, fetch(url)
                            .then(function (resp) { return resp.json(); })
                            .catch(function () {
                            throw new error_js_1.ValidationError(400, "JSON Error");
                        })];
                case 1:
                    resp = _a.sent();
                    if (isEmpty(resp)) {
                        throw new error_js_1.ValidationError(400, "Invalid vanity input");
                    }
                    resp = resp.response;
                    if (resp.success === 42) {
                        // TODO: should this be error
                        throw new error_js_1.ValidationError(400, "Vanity url has no matches");
                    }
                    return [2 /*return*/, resp.steamid];
            }
        });
    });
}
exports.resolveVanity = resolveVanity;
function getFriends(id) {
    return __awaiter(this, void 0, void 0, function () {
        var id64, url, resp, friends;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id64 = parseSteamId(id);
                    url = new URL(apiUrl + "/GetFriendList/v0001/");
                    url.searchParams.append("key", key);
                    url.searchParams.append("steamid", id64);
                    url.searchParams.append("relationship", "friend");
                    return [4 /*yield*/, fetch(url)
                            .then(function (resp) { return resp.json(); })
                            .catch(function (err) {
                            throw new error_js_1.ValidationError(400, "Unable to parse json response");
                        })];
                case 1:
                    resp = _a.sent();
                    if (isEmpty(resp)) {
                        throw new error_js_1.ValidationError(400, "User does not have public friends");
                    }
                    friends = resp.friendslist.friends.map(function (friend) { return friend.steamid; });
                    return [2 /*return*/, friends];
            }
        });
    });
}
exports.getFriends = getFriends;
function getUserSummaries(idArr) {
    return __awaiter(this, void 0, void 0, function () {
        var id64Arr, url, resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (idArr.length > 100) {
                        throw new error_js_1.ValidationError(400, "NO!!! BECAUSE I SAID SO!!!");
                    }
                    id64Arr = idArr.map(function (id) { return parseSteamId(id); });
                    url = new URL(apiUrl + "/GetPlayerSummaries/v2/");
                    url.searchParams.append("key", key);
                    url.searchParams.append("steamids", id64Arr.join(","));
                    return [4 /*yield*/, fetch(url)
                            .then(function (resp) { return resp.json(); })
                            .catch(function (err) {
                            throw new error_js_1.ValidationError(400, "Unable to parse json response");
                        })];
                case 1:
                    resp = _a.sent();
                    return [2 /*return*/, resp.response.players];
            }
        });
    });
}
exports.getUserSummaries = getUserSummaries;
