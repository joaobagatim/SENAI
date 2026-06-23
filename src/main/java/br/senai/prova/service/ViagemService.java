package br.senai.prova.service;

import br.senai.prova.dto.StatusViagemRequestDTO;
import br.senai.prova.dto.ViagemRequestDTO;
import br.senai.prova.model.StatusViagem;
import br.senai.prova.model.Viagem;
import br.senai.prova.repository.ViagemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ViagemService {

    private final ViagemRepository viagemRepository;

    public ViagemService(ViagemRepository viagemRepository) {
        this.viagemRepository = viagemRepository;
    }

    public List<Viagem> listar(StatusViagem status) {
        return status == null ? viagemRepository.findAll() : viagemRepository.findByStatus(status);
    }

    public Viagem buscarPorId(Long id) {
        return viagemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Viagem nao encontrada"));
    }

    public Viagem criar(ViagemRequestDTO dto) {
        validarDados(dto);
        Viagem viagem = new Viagem();
        preencherDados(viagem, dto);
        return viagemRepository.save(viagem);
    }

    public Viagem atualizar(Long id, ViagemRequestDTO dto) {
        validarDados(dto);
        Viagem viagem = buscarPorId(id);
        preencherDados(viagem, dto);
        return viagemRepository.save(viagem);
    }

    public Viagem atualizarStatus(Long id, StatusViagemRequestDTO dto) {
        if (dto.getStatus() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O status e obrigatorio");
        }
        Viagem viagem = buscarPorId(id);
        viagem.setStatus(dto.getStatus());
        return viagemRepository.save(viagem);
    }

    public void excluir(Long id) {
        Viagem viagem = buscarPorId(id);
        viagemRepository.delete(viagem);
    }

    private void preencherDados(Viagem viagem, ViagemRequestDTO dto) {
        viagem.setNomeColaborador(dto.getNomeColaborador());
        viagem.setDestino(dto.getDestino());
        viagem.setDataInicio(dto.getDataInicio());
        viagem.setDataRetorno(dto.getDataRetorno());
        viagem.setMotivo(dto.getMotivo());
        viagem.setStatus(dto.getStatus());
    }

    private void validarDados(ViagemRequestDTO dto) {
        if (vazio(dto.getNomeColaborador())
                || vazio(dto.getDestino())
                || dto.getDataInicio() == null
                || dto.getDataRetorno() == null
                || vazio(dto.getMotivo())
                || dto.getStatus() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Todos os campos da viagem sao obrigatorios"
            );
        }

        if (dto.getDataRetorno().isBefore(dto.getDataInicio())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A data de retorno nao pode ser anterior a data de inicio"
            );
        }
    }

    private boolean vazio(String valor) {
        return valor == null || valor.trim().isEmpty();
    }
}
