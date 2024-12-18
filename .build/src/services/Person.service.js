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
exports.PersonService = exports.PersonServiceAbstract = void 0;
var types_1 = require("../interfaces/types");
var uuid_1 = require("uuid");
var PersonServiceAbstract = /** @class */ (function () {
    function PersonServiceAbstract() {
    }
    return PersonServiceAbstract;
}());
exports.PersonServiceAbstract = PersonServiceAbstract;
var PersonService = /** @class */ (function () {
    function PersonService(planetaRepository, personaRepository, dynamoRespository) {
        this.planetaRepository = planetaRepository;
        this.personaRepository = personaRepository;
        this.dynamoRepository = dynamoRespository;
    }
    PersonService.prototype.getPerson = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, persona, planeta, personaResult, dynamoRecord;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.personaRepository.get(id),
                            this.planetaRepository.get(this.generatePlanetIds()),
                        ])];
                    case 1:
                        _a = _b.sent(), persona = _a[0], planeta = _a[1];
                        personaResult = this.mapping(persona.properties, planeta.properties);
                        dynamoRecord = __assign(__assign({}, personaResult), { id: (0, uuid_1.v4)() });
                        console.log('Persona obtenida: ', dynamoRecord);
                        return [4 /*yield*/, this.dynamoRepository.saveItem('personasTable', dynamoRecord)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, personaResult];
                }
            });
        });
    };
    PersonService.prototype.generatePlanetIds = function () {
        var id = Math.floor(Math.random() * 50);
        console.log('id plante', id);
        return id;
    };
    PersonService.prototype.mapping = function (persona, planeta) {
        return {
            nombre: persona.name,
            genero: persona.gender === 'male' ? types_1.Genero.Masculino : types_1.Genero.Femenino,
            fechaNacimiento: persona.birth_year,
            planeta: {
                nombre: planeta.name,
                gravedad: planeta.gravity === 'unknown' ? 'desconocida' : planeta.gravity,
                periodoRotacion: Number(planeta.rotation_period),
                periodoTraslacion: Number(planeta.orbital_period),
            },
        };
    };
    return PersonService;
}());
exports.PersonService = PersonService;
//# sourceMappingURL=Person.service.js.map