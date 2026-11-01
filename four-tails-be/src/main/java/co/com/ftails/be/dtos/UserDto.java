package co.com.ftails.be.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String token;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
}
