package com.IndiChess.Repository;

import com.IndiChess.Model.User;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByName(String name);

    Optional<User> findByEmail(String email);
}
