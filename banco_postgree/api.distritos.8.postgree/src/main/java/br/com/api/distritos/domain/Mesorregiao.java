package br.com.api.distritos.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class Mesorregiao extends BaseDomain {

    @ManyToOne
    @JoinColumn(name = "uf_id")
    @JsonProperty("UF")
    private UF uf;

    public UF getUf() {
        return uf;
    }

    public void setUf(UF uf) {
        this.uf = uf;
    }
}
