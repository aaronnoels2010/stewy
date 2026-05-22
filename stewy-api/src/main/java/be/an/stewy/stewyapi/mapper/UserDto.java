package be.an.stewy.stewyapi.mapper;

import be.an.stewy.stewyapi.UserRole;
import be.an.stewy.stewyapi.UserStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class UserDto {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private UserRole role;
    private UserStatus status;
}
