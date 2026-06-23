package br.senai.prova.dto;

import br.senai.prova.model.StatusViagem;

public class StatusViagemRequestDTO {

    private StatusViagem status;

    public StatusViagem getStatus() {
        return status;
    }

    public void setStatus(StatusViagem status) {
        this.status = status;
    }
}
