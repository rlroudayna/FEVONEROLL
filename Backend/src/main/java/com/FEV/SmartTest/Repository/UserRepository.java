package com.FEV.SmartTest.Repository;

import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Enum.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findAllByEmail(String email);
    List<User> findByRole(Role role);
    Optional<User> findByResetToken(String resetToken);

}
