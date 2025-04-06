package com.danilo.sellora_commerce.exceptions;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Representação padrão de erro usada nos handlers.
 */
@Data
@AllArgsConstructor
public class StandardError {

    @Schema(description = "Data e hora do erro", example = "2025-04-06T15:30:00")
    private LocalDateTime timestamp;

    @Schema(description = "Código HTTP do erro", example = "404")
    private int status;

    @Schema(description = "Mensagem explicando o erro", example = "Usuário não encontrado")
    private String message;
}
