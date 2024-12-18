export class ResponseHandler<T = any> {
    /**
     * Genera una respuesta estándar con los datos proporcionados.
     *
     * @param statusCode Código de estado HTTP.
     * @param estado Estado del resultado ('correcto' o 'error').
     * @param mensaje Mensaje descriptivo.
     * @param data Datos opcionales que se incluirán en la respuesta.
     * @returns Respuesta formateada.
     */
    private generateResponse(
      statusCode: number,
      estado: string,
      mensaje: string,
      data?: T
    ) {
      return {
        statusCode,
        body: JSON.stringify({
          estado,
          mensaje,
          data,
        }),
      };
    }
  
    /**
     * Respuesta para operaciones exitosas.
     * 
     * @param result Datos de la operación exitosa.
     * @param mensaje Mensaje opcional.
     * @returns Respuesta con código 200.
     */
    public ok(result: T, mensaje: string = 'Consulta realizada correctamente') {
      return this.generateResponse(200, 'correcto', mensaje, result);
    }
  
    /**
     * Respuesta para errores de cliente (solicitud incorrecta).
     * 
     * @param mensaje Mensaje del error.
     * @returns Respuesta con código 400.
     */
    public badRequest(mensaje: string = 'Solicitud incorrecta') {
      return this.generateResponse(400, 'error', mensaje);
    }
  
    /**
     * Respuesta para errores internos del servidor.
     * 
     * @param mensaje Mensaje del error.
     * @returns Respuesta con código 500.
     */
    public internalError(mensaje: string = 'Error interno del servidor') {
      return this.generateResponse(500, 'error', mensaje);
    }
  }