package com.csniico.userService.dto;

import lombok.Getter;

@Getter
public class UserRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Long userId;
    private String role;
}
