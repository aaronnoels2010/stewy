package be.an.stewy.stewyapi.mapper;

import be.an.stewy.stewyapi.UserRegistrationDto;
import be.an.stewy.stewyapi.domain.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User mapRegistrationDtoToUser(UserRegistrationDto dto);

    UserDto mapUserToUserDto(User user);
}
