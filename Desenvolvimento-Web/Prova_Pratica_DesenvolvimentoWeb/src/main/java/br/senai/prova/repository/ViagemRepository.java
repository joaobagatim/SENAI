package br.senai.prova.repository;

import br.senai.prova.model.StatusViagem;
import br.senai.prova.model.Viagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ViagemRepository extends JpaRepository<Viagem, Long> {

    List<Viagem> findByStatus(StatusViagem status);
}
