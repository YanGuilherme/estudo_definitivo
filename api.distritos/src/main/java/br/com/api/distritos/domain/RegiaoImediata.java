package br.com.api.distritos.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class RegiaoImediata extends BaseDomain {

    @ManyToOne
    @JoinColumn(name = "regiao_intermediaria_id")
    @JsonProperty("regiao-intermediaria")
    private RegiaoIntermediaria regiaoIntermediaria;

    public RegiaoIntermediaria getRegiaoIntermediaria() {
        return regiaoIntermediaria;
    }

    public void setRegiaoIntermediaria(RegiaoIntermediaria regiaoIntermediaria) {
        this.regiaoIntermediaria = regiaoIntermediaria;
    }
}
