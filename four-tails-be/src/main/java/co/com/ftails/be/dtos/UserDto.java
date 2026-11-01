package co.com.ftails.be.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private LocalDate birthDate;
    private String address;
    private String phone;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String token;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
}
