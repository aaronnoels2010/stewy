package be.an.stewy.stewyapi;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        Map<String,String> errors = new HashMap<>();

        var err =((BeanPropertyBindingResult) ex.getBindingResult());
        err.getAllErrors().forEach(e -> errors.put(e.getCode(), e.getDefaultMessage()));

        return ResponseEntity.badRequest().body(errors);
    }
}
