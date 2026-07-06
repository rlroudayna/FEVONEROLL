package com.FEV.SmartTest.Controller;


import com.FEV.SmartTest.Entity.ValidationTechnicien;
import com.FEV.SmartTest.Enum.DecisionValidation;
import com.FEV.SmartTest.Service.ValidationTechnicienService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/validation_technicien")
public class ValidationTechnicienController {

    private final ValidationTechnicienService validationService;

    public ValidationTechnicienController(ValidationTechnicienService validationService) {
        this.validationService = validationService;
    }

    @PostMapping("/{demandeId}")
    public ValidationTechnicien validerDemande(
            @PathVariable Long demandeId,
            @RequestBody ValidationTechnicien validation,
            Authentication authentication
    ) {
        return validationService.validerDemande(
                demandeId,
                validation.getDecision(),
                validation.getCommentaire(),
                authentication
        );
    }
}


