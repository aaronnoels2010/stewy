package be.an.stewy.stewyapi.validator;

import be.an.stewy.stewyapi.VolunteerRegistrationDto;
import be.an.stewy.stewyapi.domain.Volunteer;
import lombok.SneakyThrows;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.Objects;

@Component
public class VolunteerValidator implements Validator {
    @Override
    public boolean supports(Class<?> clazz) {
        return VolunteerRegistrationDto.class.equals(clazz);
    }

    @SneakyThrows
    @Override
    public void validate(Object target, Errors errors) {
        VolunteerRegistrationDto volunteer = (VolunteerRegistrationDto) target;

        if (volunteer.getClubId() == null){
            errors.rejectValue("clubId","clubId","clubId should be filled in");
        }

        if (errors.hasErrors()){
            throw new MethodArgumentNotValidException((MethodParameter) null, (BindingResult) errors);
        }
    }
}
