package com.userhub.userhub.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.userhub.userhub.model.UserModel;
import com.userhub.userhub.service.UserService;

class UserResponse {
    private String message;
    private List<UserModel> users;

    public UserResponse(String message, List<UserModel> users) {
        this.message = message;
        this.users = users;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<UserModel> getUsers() {
        return users;
    }

    public void setUsers(List<UserModel> users) {
        this.users = users;
    }
}

@CrossOrigin(origins = "http://localhost:5173/")
@Component
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/add-user")
    public ResponseEntity<String> addUser(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("image") MultipartFile imageFile) {
        Boolean isAdded = userService.addUser(name, email, password, imageFile);
        if (isAdded) {
            String message = "User created successfully!";
            return new ResponseEntity<>(message, HttpStatus.OK);
        } else {
            String errorMessage = "User already exist.";
            return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/get-users")
    public ResponseEntity<UserResponse> getUsers() {
        List<UserModel> users = userService.getUsers();
        if (!users.isEmpty()) {
            UserResponse response = new UserResponse("Users found successfully!", users);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            UserResponse response = new UserResponse("No users found.", new ArrayList<>());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete-users/{userId}")
    public ResponseEntity<String> deleteUserEntity(@PathVariable String userId) {
        Boolean isDeleted = userService.deleteUser(userId);
        if (isDeleted) {
            String message = "User deleted successfully!";
            return new ResponseEntity<>(message, HttpStatus.OK);
        } else {
            String message = "Failed to delete user!";
            return new ResponseEntity<>(message, HttpStatus.OK);
        }
    }

    @PutMapping("/edit-user/{userId}")
    public ResponseEntity<String> editUser(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("image") MultipartFile imageFile,
            @RequestParam("imageString") String imageString,
            @PathVariable String userId
    ) throws IOException {
        Boolean isEdited = userService.editUser(name, email, password, imageFile, imageString, userId);
        if (isEdited) {
            String message = "User edited successfully!";
            return new ResponseEntity<>(message, HttpStatus.OK);
        } else {
            String errorMessage = "There is something wrong.";
            return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
        }
    }


}
