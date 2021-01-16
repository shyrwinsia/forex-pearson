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
        while (_) try {
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
var fs = require('fs');
var request = require('request-promise');
var promisify = require('util').promisify;
var writeFile = promisify(fs.writeFile);
var readFile = promisify(fs.readFile);
function getCsvFromUrl(url) {
    return __awaiter(this, void 0, void 0, function () {
        var contents, contents_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Fetching from: ' + url);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, request(url)];
                case 2:
                    contents_1 = _a.sent();
                    return [2 /*return*/, contents_1];
                case 3:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function processData(contents) {
    if (!contents)
        throw 'Nope! Contents is empty.';
    console.log('Processing data');
    var rows;
    var quotes = [];
    rows = contents.split('\n');
    rows.map(function (i) {
        var columns;
        columns = i.split(',');
        var base = columns[0];
        var quote = columns[1];
        var daily = parseFloat(columns[5]);
        if (base !== quote && Math.abs(daily) >= 80) {
            if (daily > 0)
                daily = daily - 80;
            else
                daily = daily + 80;
            daily = daily * 5;
            quotes.push({ base: base, quote: quote, daily: daily });
        }
    });
    return quotes;
}
function constructJson(data) {
    console.log('Constructing graph');
    var nodes = [];
    var links = [];
    data.map(function (i) {
        if (!nodes.find(function (j) {
            if (i['base'] === j['id'])
                return true;
            else
                return false;
        })) {
            nodes.push({ id: i['base'], group: 1 });
            // check if a link between then source and destination has been created
            if (!links.find(function (j) {
                if (i['base'] === j['target'] && i['quote'] === j['source'])
                    return true;
                else
                    return false;
            }))
                links.push({
                    source: i['base'],
                    target: i['quote'],
                    coefficient: i['daily']
                });
        }
    });
    return { nodes: nodes, links: links };
}
function writeJsonToFile(json) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, writeFile('public/correlation.json', JSON.stringify(json, null, 2))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var fileContents, lines, params, contents, quotes, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readFile('whitelist.txt', 'UTF-8')];
                case 1:
                    fileContents = _a.sent();
                    lines = fileContents.split(/\r?\n/);
                    params = '';
                    lines.forEach(function (line) {
                        console.log(line);
                        params += line + "|";
                    });
                    params = params.slice(0, -1);
                    return [4 /*yield*/, getCsvFromUrl('https://www.mataf.io/api/tools/csv/correl/snapshot/forex/50/correlation.csv?symbol=' + params)];
                case 2:
                    contents = _a.sent();
                    quotes = processData(contents);
                    json = constructJson(quotes);
                    return [4 /*yield*/, writeJsonToFile(json)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
