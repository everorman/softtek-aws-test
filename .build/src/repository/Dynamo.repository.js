"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.DynamoRepository = void 0;
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
var constants_1 = require("../common/constants");
var util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
var DynamoRepository = /** @class */ (function () {
    function DynamoRepository(region, isLocal) {
        if (isLocal === void 0) { isLocal = false; }
        var options = { region: region };
        // Configura el endpoint para DynamoDB local si isLocal es true
        if (isLocal) {
            options.endpoint = 'http://localhost:8000';
        }
        var dynamoClient = new client_dynamodb_1.DynamoDBClient(options);
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(dynamoClient);
    }
    /**
     * Almacena un objeto en una tabla de DynamoDB.
     * @param tableName - El nombre de la tabla en DynamoDB.
     * @param item - El objeto que se almacenará en la tabla.
     */
    DynamoRepository.prototype.saveItem = function (tableName, item) {
        return __awaiter(this, void 0, void 0, function () {
            var params, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: tableName,
                            Item: item,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.send(new lib_dynamodb_1.PutCommand(params))];
                    case 2:
                        _a.sent();
                        console.log("Item guardado exitosamente en la tabla ".concat(tableName));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error al guardar el item en DynamoDB:', error_1);
                        throw new Error('No se pudo guardar el item en DynamoDB');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtiene un objeto en una tabla de DynamoDB.
     * @param tableName - El nombre de la tabla en DynamoDB.
     * @param id - Id de objeto a consultar.
     */
    DynamoRepository.prototype.getItemById = function (tableName, id) {
        return __awaiter(this, void 0, void 0, function () {
            var params, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: tableName,
                            Key: {
                                id: id,
                            },
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.send(new lib_dynamodb_1.GetCommand(params))];
                    case 2:
                        result = _a.sent();
                        if (!result.Item) {
                            console.warn("El registro con ID ".concat(id, " no se encontr\u00F3 en la tabla ").concat(tableName));
                            return [2 /*return*/, null];
                        }
                        console.log("Registro obtenido de la tabla ".concat(tableName, ":"), result.Item);
                        return [2 /*return*/, result.Item];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error al obtener el registro de DynamoDB:', error_2);
                        throw new Error('No se pudo obtener el registro de DynamoDB');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DynamoRepository.prototype.getAllItemsPaginated = function (tableName, limit, lastEvaluatedKey) {
        return __awaiter(this, void 0, void 0, function () {
            var params, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: tableName,
                            Limit: limit,
                            ExclusiveStartKey: lastEvaluatedKey,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.send(new client_dynamodb_1.ScanCommand(params))];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, {
                                items: (result.Items || []),
                                lastEvaluatedKey: result.LastEvaluatedKey,
                            }];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error al obtener los registros paginados de DynamoDB:', error_3);
                        throw new Error('No se pudo obtener los registros paginados de DynamoDB');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DynamoRepository.prototype.savePersona = function (persona) {
        return __awaiter(this, void 0, void 0, function () {
            var params, command, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = {
                            TableName: constants_1.PERSONAS_TABLE_NAME,
                            Item: (0, util_dynamodb_1.marshall)(__assign({}, persona)),
                        };
                        command = new client_dynamodb_1.PutItemCommand(params);
                        return [4 /*yield*/, this.client.send(command)];
                    case 1:
                        _a.sent();
                        console.log('Persona guardada exitosamente en DynamoDB');
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error al guardar la persona en DynamoDB:', error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return DynamoRepository;
}());
exports.DynamoRepository = DynamoRepository;
//# sourceMappingURL=Dynamo.repository.js.map