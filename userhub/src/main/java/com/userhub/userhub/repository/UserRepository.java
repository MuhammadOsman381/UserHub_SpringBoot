package com.userhub.userhub.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;
import com.userhub.userhub.model.UserModel;

@Component
public interface UserRepository extends MongoRepository<UserModel, ObjectId> {

}
