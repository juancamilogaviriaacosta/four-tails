package co.com.ftails.be.util;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception ex) {
        ex.printStackTrace();
        Map<String, String> body = Map.of(
            "error", String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value()),
            "message", HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        ex.printStackTrace();
        Map<String, String> body = Map.of(
            "error", String.valueOf(HttpStatus.CONFLICT.value()),
            "message", HttpStatus.CONFLICT.getReasonPhrase()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }
}
