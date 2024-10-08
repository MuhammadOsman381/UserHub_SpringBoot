package com.userhub.userhub.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Component;
import lombok.Data;

@Component
@Data
@Document(collection = "User")
public class UserModel {
    @Id
    private ObjectId id;
    private String name;
    private String email;
    private String password;
    private String image;

    public String getId() {
        return id != null ? id.toHexString() : null;
    }
}
