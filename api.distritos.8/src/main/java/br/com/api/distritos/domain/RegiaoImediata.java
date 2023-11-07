package br.com.api.distritos.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;


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
