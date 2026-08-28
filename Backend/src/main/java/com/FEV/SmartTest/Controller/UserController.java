package com.FEV.SmartTest.Controller;

import com.FEV.SmartTest.DTO.ChangePasswordRequest;
import com.FEV.SmartTest.DTO.UserRequestDTO;
import com.FEV.SmartTest.DTO.UserResponseDTO;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Service.CustomUserDetailsService;
import com.FEV.SmartTest.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")

public class UserController {

    private final UserService userService;
    private final CustomUserDetailsService customUserDetailsService ;

    public UserController(UserService userService, CustomUserDetailsService customUserDetailsService) {
        this.userService = userService;
        this.customUserDetailsService = customUserDetailsService;
    }

    // GET all users

    @PreAuthorize("hasRole('ADMIN')")

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }



    @PutMapping("/me/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(request);

        return ResponseEntity.ok(
                Map.of("message", "Mot de passe modifié avec succès")
        );
    }
    @GetMapping("/technicien-essai/client")
    public List<User> getChargeEssaiByClient() {
        return userService.getTechniciens();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgot(
            @RequestBody Map<String, String> request) {

        try {
            userService.forgotPassword(request.get("email"));

            return ResponseEntity.ok(
                    Map.of("message", "Email envoyé avec succès")
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    @PostMapping("/reset-password")
    public void reset(@RequestParam String token,
                      @RequestParam String password) {
        userService.resetPassword(token, password);
    }
    @GetMapping("/techniciens")
    public List<User> getTechniciens() {
        return userService.getTechniciens();
    }
    @GetMapping("/charges")
    public List<User> getChargesEssai() {
        return userService.getChargesEssai();
    }


    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id,
                           @RequestBody UserRequestDTO user) {
        return userService.updateUser(id, user);
    }
    // DELETE user

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUserEndpoint() {
        Optional<User> currentUser = customUserDetailsService.getCurrentUser();

        if (currentUser.isEmpty()) {
            return ResponseEntity.status(401).build(); // non authentifié
        }

        return ResponseEntity.ok(currentUser.get());
    }

    @PutMapping("/{id}/image")
    public ResponseEntity<User> updateImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(userService.updateProfileImage(id, file));
    }

    @PutMapping("/{id}/phone")
    public ResponseEntity<User> updatePhone(
            @PathVariable Long id,
            @RequestBody String phone
    ) {
        phone = phone.replace("\"", "").trim();

        User updatedUser = userService.updatePhone(id, phone);
        return ResponseEntity.ok(updatedUser);
    }

}
