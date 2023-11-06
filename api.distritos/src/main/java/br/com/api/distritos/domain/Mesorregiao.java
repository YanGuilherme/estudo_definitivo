package br.com.api.distritos.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

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
