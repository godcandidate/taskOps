package com.csniico.userService.controller;

import com.csniico.userService.Entity.User;
import com.csniico.userService.Services.UserCRUDService;
import com.csniico.userService.Services.UserServiceMessagePublisher;
import com.csniico.userService.dto.ApiResponse;
import com.csniico.userService.dto.UserRequest;
import com.csniico.userService.dto.UserResponse;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.naming.AuthenticationException;
import java.util.Collections;
import java.util.List;

@Data
@RestController
@RequestMapping("/api/v1")
public class EventController {

    private final UserServiceMessagePublisher publisher;
    private  RestTemplate restTemplate;
    private final UserCRUDService userCRUDService;

    public EventController(
            UserServiceMessagePublisher publisher,
            UserCRUDService userCRUDService,
            RestTemplate restTemplate
    ) {
        this.publisher = publisher;
        this.userCRUDService = userCRUDService;
        this.restTemplate = restTemplate;
    }

    @GetMapping("/")
    public String home() {
        return "Hello World!";
    }

    @PostMapping("/create")
    public ResponseEntity<?> createNewUser(@RequestBody UserRequest userRequest) {
        try {
            boolean created = userCRUDService.createUser(userRequest);
            if (created) {
                publisher.sendUserCreatedMessageToTopic(userRequest);
                return ResponseEntity.ok("User created successfully");
            } else {
                return ResponseEntity.badRequest().body("User already exists");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody UserRequest userRequest) {
        try {
            userCRUDService.updateUser(userRequest);
            return ResponseEntity.ok("User updated successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(@RequestBody UserRequest userRequest) {
        try {
            userCRUDService.deleteUser(userRequest.getUserId());
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/get")
    public ResponseEntity<?> getUser(@RequestParam Long userId) {
        try {
            User user = userCRUDService.getUser(userId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>("User not found", null));
            }
            UserResponse userResponse = new UserResponse(user);
            return ResponseEntity.ok(new ApiResponse<>("User retrieved successfully", userResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Error retrieving user: " + e.getMessage(), null));
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody UserRequest userRequest) {
        if (userRequest.getEmail() == null || userRequest.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email and password are required.");
        }

        try {
            User user = userCRUDService.signIn(userRequest.getEmail(), userRequest.getPassword());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>("Invalid credentials.", null));
            }

            UserResponse userResponse = new UserResponse(user);
            return ResponseEntity.ok(new ApiResponse<>("Sign-in successful.", userResponse));
        } catch (Exception ex) {
             System.out.println("Sign-in error " + ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("An error occurred while processing your request.", null));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody UserRequest userRequest) {
        if (userRequest.getEmail() == null || userRequest.getPassword() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("Email and password are required.", null));
        }

        try {
            boolean created = userCRUDService.createUser(userRequest);
            if (created) {
                User user = userCRUDService.getUserByEmail(userRequest.getEmail());
                UserResponse userResponse = new UserResponse(user);
                publisher.sendUserCreatedMessageToTopic(userRequest);
                return ResponseEntity.ok(new ApiResponse<>("User created successfully", userResponse));
            } else {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>("User already exists", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("An error occurred while processing your request.", null));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<UserResponse> users = userCRUDService.getAllUsers();
            if (users.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>("No users found", Collections.emptyList()));
            }
            return ResponseEntity.ok(new ApiResponse<>("Users retrieved successfully", users));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Error retrieving users: " + e.getMessage(), null));
        }
    }
}