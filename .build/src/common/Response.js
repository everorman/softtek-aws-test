"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
var ResponseHandler = /** @class */ (function () {
    function ResponseHandler() {
    }
    /**
     * Genera una respuesta estándar con los datos proporcionados.
     *
     * @param statusCode Código de estado HTTP.
     * @param estado Estado del resultado ('correcto' o 'error').
     * @param mensaje Mensaje descriptivo.
     * @param data Datos opcionales que se incluirán en la respuesta.
     * @returns Respuesta formateada.
     */
    ResponseHandler.prototype.generateResponse = function (statusCode, estado, mensaje, data) {
        return {
            statusCode: statusCode,
            body: JSON.stringify({
                estado: estado,
                mensaje: mensaje,
                data: data,
            }),
        };
    };
    /**
     * Respuesta para operaciones exitosas.
     *
     * @param result Datos de la operación exitosa.
     * @param mensaje Mensaje opcional.
     * @returns Respuesta con código 200.
     */
    ResponseHandler.prototype.ok = function (result, mensaje) {
        if (mensaje === void 0) { mensaje = 'Consulta realizada correctamente'; }
        return this.generateResponse(200, 'correcto', mensaje, result);
    };
    /**
     * Respuesta para errores de cliente (solicitud incorrecta).
     *
     * @param mensaje Mensaje del error.
     * @returns Respuesta con código 400.
     */
    ResponseHandler.prototype.badRequest = function (mensaje) {
        if (mensaje === void 0) { mensaje = 'Solicitud incorrecta'; }
        return this.generateResponse(400, 'error', mensaje);
    };
    /**
     * Respuesta para errores internos del servidor.
     *
     * @param mensaje Mensaje del error.
     * @returns Respuesta con código 500.
     */
    ResponseHandler.prototype.internalError = function (mensaje) {
        if (mensaje === void 0) { mensaje = 'Error interno del servidor'; }
        return this.generateResponse(500, 'error', mensaje);
    };
    return ResponseHandler;
}());
exports.ResponseHandler = ResponseHandler;
//# sourceMappingURL=Response.js.map