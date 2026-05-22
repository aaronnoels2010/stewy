package be.an.stewy.stewyapi;

import be.an.stewy.stewyapi.mapper.UserDto;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponseDto {
    private String token;
    private UserDto user;
}
