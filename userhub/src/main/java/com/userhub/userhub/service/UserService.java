package com.userhub.userhub.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.multipart.MultipartFile;

import com.userhub.userhub.model.UserModel;
import com.userhub.userhub.repository.UserRepository;

@CrossOrigin(origins = "http://192.168.18.8:5173/")
@Component
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public boolean addUser(String name, String email, String password, MultipartFile imageFile) {
        if (imageFile.isEmpty()) {
            return false;
        }
        try {
            Path uploadPath = Paths.get("src/main/resources/static/uploads/");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            byte[] bytes = imageFile.getBytes();
            String imgPathForDb = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
            Path imagePath = uploadPath.resolve(imgPathForDb);
            Files.write(imagePath, bytes);
            UserModel newUser = new UserModel();
            newUser.setName(name);
            newUser.setEmail(email);
            newUser.setPassword(password);
            newUser.setImage("uploads/" + imgPathForDb);
            userRepository.save(newUser);
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<UserModel> getUsers() {
        List<UserModel> users = userRepository.findAll();
        return users;
    }

    public Boolean deleteUser(String userId) {
        Path uploadDirPath = Paths.get("src/main/resources/static/");
        ObjectId userObjId = new ObjectId(userId);
        Optional<UserModel> optionalUser = userRepository.findById(userObjId);
        if (optionalUser.isPresent()) {
            UserModel user = optionalUser.get();
            Path userImgPath = uploadDirPath.resolve(user.getImage());
            File file = userImgPath.toFile();
            boolean isDeleted = file.delete();
            if (!isDeleted) {
                System.out.println("Failed to delete the image file: " + userImgPath);
            }
            userRepository.delete(user);
            return true;
        } else {
            System.out.println("User not found with ID: " + userId);
            return false;
        }
    }

    public Boolean editUser(String name, String email, String password, MultipartFile imageFile, String imageString,
            String userId) throws IOException {
        ObjectId userObjId = new ObjectId(userId);
        Optional<UserModel> optionalUser = userRepository.findById(userObjId);
        if (optionalUser.isPresent()) {
            UserModel use = optionalUser.get();
            if (imageFile != null) {
                Path uploadPath = Paths.get("src/main/resources/static/uploads/");
                Path uploadDirPath = Paths.get("src/main/resources/static/");
                Path userImgPath = uploadDirPath.resolve(use.getImage());
                File file = userImgPath.toFile();
                boolean isDeleted = file.delete();
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                byte[] bytes = imageFile.getBytes();
                String imgPathForDb = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
                Path imagePath = uploadPath.resolve(imgPathForDb);
                Files.write(imagePath, bytes);
                use.setName(name);
                use.setEmail(email);
                use.setPassword(password);
                use.setImage("uploads/" + imgPathForDb);
                userRepository.save(use);
                return true;
            } else {
                use.setName(name);
                use.setEmail(email);
                use.setPassword(password);
                use.setImage(imageString);
                userRepository.save(use);
                return true;
            }
        }
        return false;
    }
}
