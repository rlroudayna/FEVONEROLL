package com.FEV.SmartTest.Controller;

import com.FEV.SmartTest.Configuration.JwtUtils;
import com.FEV.SmartTest.DTO.UserRequestDTO;
import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Repository.ClientRepository;
import com.FEV.SmartTest.Repository.UserRepository;
import com.FEV.SmartTest.Service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")

public class AuthController {
    private final UserRepository userRepository;
    private final UserService userService;

    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final ClientRepository clientRepository;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRequestDTO dto) {

        if (!userRepository.findAllByEmail(dto.getEmail()).isEmpty()) {
            return ResponseEntity.badRequest().body("Cet email est déjà utilisé.");
        }

        User user = new User();

        user.setNom(dto.getNom());
        user.setPrenom(dto.getPrenom());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        user.setNumeroTelephone(dto.getNumeroTelephone());
        user.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));

        // 🔥 IMPORTANT: mapping clientId
        if (dto.getClientId() != null) {

            Client client = clientRepository.findById(dto.getClientId())
                    .orElseThrow(() -> new RuntimeException("Client introuvable"));

            user.setClient(client);
        }

        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            user.getMotDePasse()
                    )
            );

            if (authentication.isAuthenticated()) {

                // 🔥 récupérer depuis la base
                User userFromDb = userRepository.findByEmail(user.getEmail())
                        .orElseThrow(() -> new RuntimeException("User not found"));

                Map<String, Object> authData = new HashMap<>();

                authData.put("token",
                        jwtUtils.generateToken(
                                userFromDb.getEmail(),
                                userFromDb.getRole().name()
                        )
                );

                authData.put("type", "Bearer");

                return ResponseEntity.ok(authData);
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Nom d’utilisateur ou mot de passe invalide.");

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Nom d’utilisateur ou mot de passe invalide.");
        }
    }
}
