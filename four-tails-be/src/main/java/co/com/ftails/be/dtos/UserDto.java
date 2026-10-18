package co.com.ftails.be.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    private String email;
    private String firstName;
    private String lastName;
    private String password;
}
