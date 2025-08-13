package com.csniico.userService.Services;

import com.csniico.userService.Entity.User;
import com.csniico.userService.dto.UserRequest;
import com.csniico.userService.dto.UserResponse;
import com.csniico.userService.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class that handles CRUD (Create, Read, Update, Delete) operations for User entities.
 * This service provides methods for user management including creation, updating, deletion,
 * retrieval, and authentication.
 */

@Service
public class UserCRUDService {

    private final UserRepository userRepository;

    @Autowired
    public UserCRUDService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Creates a new user in the system based on the provided user request.
     *
     * @param userRequest The user information containing firstName, lastName, email, and password
     * @return boolean Returns true if user creation is successful, false if user already exists
     * @throws IllegalArgumentException if required fields are missing or invalid
     * @throws RuntimeException if there's a system error during user creation
     */
    public boolean createUser(UserRequest userRequest) {
        // Validate required fields
        if (userRequest == null) {
            throw new IllegalArgumentException("User request cannot be null");
        }
        if (userRequest.getEmail() == null || userRequest.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (userRequest.getPassword() == null || userRequest.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }

        try {
            // Check if a user already exists
            User existingUser = userRepository.findByEmail(userRequest.getEmail().trim());
            if (existingUser != null) {
                return false;
            }

            // Create a new user with sanitized input
            User user = new User();
            user.setFirstName(sanitizeInput(userRequest.getFirstName()));
            user.setLastName(sanitizeInput(userRequest.getLastName()));
            user.setEmail(userRequest.getEmail().trim().toLowerCase());
            user.setPassword(hashPassword(userRequest.getPassword()));
            user.setRole(userRequest.getRole());

            userRepository.save(user);
            return true;
        } catch (Exception ex) {
            throw new RuntimeException("Error creating user: " + ex.getMessage(), ex);
        }
    }

    /**
     * Sanitizes input strings to prevent XSS and other injection attacks
     */
    private String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }
        // Basic sanitization - you might want to use a proper library like OWASP Java Encoder
        return input.trim()
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("\"", "&quot;")
                .replaceAll("'", "&#x27;")
                .replaceAll("&", "&amp;");
    }

    /**
     * Hashes the password using a secure hashing algorithm
     * This is a placeholder-implement proper password hashing
     */
    private String hashPassword(String password) {
        return password;
    }

    /**
     * Updates an existing user's information.
     *
     * @param userRequest The user information containing userId, firstName, lastName, email, and password
     * @throws RuntimeException if the user is not found, or if there's an error during the update
     */

    public void updateUser(UserRequest userRequest) {
        try{
            User user = userRepository.findById(userRequest.getUserId()).get();
            user.setFirstName(userRequest.getFirstName());
            user.setLastName(userRequest.getLastName());
            user.setEmail(userRequest.getEmail());
            user.setPassword(userRequest.getPassword());
            user.setRole(userRequest.getRole());
            userRepository.save(user);
        }catch(Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    /**
     * Deletes a user from the system by their ID.
     *
     * @param userId The unique identifier of the user to be deleted
     * @throws RuntimeException if there's an error during deletion
     */

    public void deleteUser(Long userId) {
        try{
            userRepository.deleteById(userId);
        }catch(Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    /**
     * Retrieves all users from the database and converts them to UserResponse DTOs.
     * Sensitive information like passwords is excluded from the response.
     *
     * @return List<UserResponse> List of all users with safe data
     * @throws RuntimeException if there's an error, retrieving the users
     */
    public List<UserResponse> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return users.stream()
                    .map(UserResponse::new)
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            throw new RuntimeException("Error retrieving users: " + ex.getMessage(), ex);
        }
    }

    /**
     * Retrieves a user by their ID.
     *
     * @param userId The unique identifier of the user to retrieve
     * @return User The found user entity
     * @throws RuntimeException if the user is not found, or if there's an error during retrieval
     */
    public User getUser(Long userId) {
        try{
            return userRepository.findById(userId).get();
        }catch(Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    /**
     * Retrieves a user by their email address.
     *
     * @param email The email address of the user to retrieve
     * @return User The found user entity
     * @throws RuntimeException if the user is not found, or if there's an error during retrieval
     */
    public User getUserByEmail(String email) {
        try{
            User user = userRepository.findByEmail(email);
            if(user == null) {
                throw new RuntimeException("User not found");
            }

            return user;
        }catch(Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    /**
     * Authenticates a user using email and password.
     *
     * @param email The user's email address
     * @param password The user's password
     * @return User The authenticated user entity
     * @throws RuntimeException if the user is not found, the password is invalid, or if there's an error during authentication
     */
    public User signIn(String email, String password) {
        try{
            User user = userRepository.findByEmail(email);
            if(user == null) {
                throw new RuntimeException("User not found");
            }
            if(!user.getPassword().equals(password)) {
                throw new RuntimeException("Invalid password");
            }

            return user;
        }catch(Exception ex) {
            throw new RuntimeException(ex);
        }
    }
}
