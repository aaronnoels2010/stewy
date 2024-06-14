package be.an.stewy.stewyapi.advice;

import be.an.stewy.stewyapi.exception.CustomException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class PersonExceptionHandler {
    @ExceptionHandler(CustomException.class)
        public ResponseEntity<ErrorResponse> handleUserNotFoundException(CustomException e) {

        return new ResponseEntity<>(new ErrorResponse(e.getMessage()), HttpStatus.NOT_FOUND);
    }
}
