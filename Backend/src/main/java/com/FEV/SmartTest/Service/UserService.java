package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.DTO.ChangePasswordRequest;
import com.FEV.SmartTest.DTO.UserRequestDTO;
import com.FEV.SmartTest.DTO.UserResponseDTO;
import com.FEV.SmartTest.Entity.Client;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Enum.Role;
import com.FEV.SmartTest.Mappers.UserMapper;
import com.FEV.SmartTest.Repository.ClientRepository;
import com.FEV.SmartTest.Repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private  final CustomUserDetailsService userDetailsService;
    private final CustomUserDetailsService customUserDetailsService;
    private final EmailService emailService;
    private final ClientRepository clientRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, CustomUserDetailsService userDetailsService, CustomUserDetailsService customUserDetailsService, EmailService emailService, ClientRepository clientRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDetailsService = userDetailsService;
        this.customUserDetailsService = customUserDetailsService;
        this.emailService = emailService;
        this.clientRepository = clientRepository;
        this.userMapper = userMapper;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        return userMapper.mapToDto(user);
    }

    public User updateUser(Long id, UserRequestDTO dto) {

        return userRepository.findById(id).map(user -> {

            user.setNom(dto.getNom());
            user.setPrenom(dto.getPrenom());
            user.setEmail(dto.getEmail());
            user.setRole(dto.getRole());
            user.setNumeroTelephone(dto.getNumeroTelephone());
            user.setImage(user.getImage());

            // 🔥 ICI: CLIENT PROPRE
            Client client = clientRepository.findById(dto.getClientId())
                    .orElseThrow(() -> new RuntimeException("Client introuvable"));

            user.setClient(client);

            // password optionnel
            if (dto.getMotDePasse() != null && !dto.getMotDePasse().isEmpty()) {
                user.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));
            }

            return userRepository.save(user);

        }).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec id : " + id));
    }
    // Supprimer un utilisateur
    public void deleteUser(Long id) {
        //checkAdmin();
        userRepository.deleteById(id);
    }

    public User updateProfileImage(Long id, MultipartFile file) {

        try {

            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            if (file.getSize() > 2 * 1024 * 1024) {
                throw new RuntimeException("L'image ne doit pas dépasser 2 Mo");
            }

            String contentType = file.getContentType();
            if (contentType == null ||
                    !(contentType.equals("image/jpeg") ||
                            contentType.equals("image/png") ||
                            contentType.equals("image/jpg"))) {
                throw new RuntimeException("Format invalide (jpg/png uniquement)");
            }

            String uploadDir = "uploads/users/";
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID() + ".png";

            Path filePath = uploadPath.resolve(fileName);

            // ✔ plus safe que copy direct
            Files.copy(file.getInputStream(), filePath);

            // URL publique
            String imageUrl = "/uploads/users/" + fileName;

            user.setImage(imageUrl);

            return userRepository.save(user);

        } catch (Exception e) {
            throw new RuntimeException("Erreur upload image", e);
        }
    }
    public User updatePhone(Long id, String phone) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        user.setNumeroTelephone(phone);

        return userRepository.save(user);
    }
    public void changePassword(ChangePasswordRequest request) {

        User user = customUserDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getMotDePasse())) {
            throw new RuntimeException("Ancien mot de passe incorrect");
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 8) {
            throw new RuntimeException("Le nouveau mot de passe doit contenir au moins 8 caractères");
        }

        user.setMotDePasse(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void forgotPassword(String email) {

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            String token = UUID.randomUUID().toString();

            user.setResetToken(token);
            user.setTokenExpiration(LocalDateTime.now().plusMinutes(30));

            userRepository.save(user);

            String link = "http://192.168.1.15:5173/reset-password?token=" + token;

            emailService.sendResetEmail(user.getEmail(), link);
        }
        else {

            throw new RuntimeException("Aucun compte associé à cet email");
    }

    }

    public void resetPassword(String token, String newPassword) {

        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Token invalide"));

        if (user.getTokenExpiration().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expiré");
        }

        if (newPassword == null || newPassword.length() < 8) {
            throw new RuntimeException("Mot de passe trop court");
        }

        user.setMotDePasse(passwordEncoder.encode(newPassword));

        user.setResetToken(null);
        user.setTokenExpiration(null);

        userRepository.save(user);
    }

    public List<User> getTechniciens() {
        return userRepository.findByRole(Role.TECHNICIEN_ESSAI);
    }
    public List<User> getChargesEssai() {
        return userRepository.findByRole(Role.CHARGE_ESSAI);
    }

}
