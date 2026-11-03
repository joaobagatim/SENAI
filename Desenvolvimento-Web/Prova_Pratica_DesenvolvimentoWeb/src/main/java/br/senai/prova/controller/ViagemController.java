package br.senai.prova.controller;

import br.senai.prova.dto.StatusViagemRequestDTO;
import br.senai.prova.dto.ViagemRequestDTO;
import br.senai.prova.model.StatusViagem;
import br.senai.prova.model.Viagem;
import br.senai.prova.service.ViagemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/viagens")
public class ViagemController {

    private final ViagemService viagemService;

    public ViagemController(ViagemService viagemService) {
        this.viagemService = viagemService;
    }

    @PostMapping
    public ResponseEntity<Viagem> criar(@RequestBody ViagemRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(viagemService.criar(dto));
    }

    @GetMapping
    public ResponseEntity<List<Viagem>> listar(
            @RequestParam(required = false) StatusViagem status) {
        return ResponseEntity.ok(viagemService.listar(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Viagem> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(viagemService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Viagem> atualizar(
            @PathVariable Long id,
            @RequestBody ViagemRequestDTO dto) {
        return ResponseEntity.ok(viagemService.atualizar(id, dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Viagem> atualizarStatus(
            @PathVariable Long id,
            @RequestBody StatusViagemRequestDTO dto) {
        return ResponseEntity.ok(viagemService.atualizarStatus(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        viagemService.excluir(id);
        return ResponseEntity.noContent().build();
    }

}