package br.com.api.distritos.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;


@Entity
public class Municipio extends BaseDomain {

    @ManyToOne
    @JoinColumn(name = "microrregiao_id")
    private Microrregiao microrregiao;

    @ManyToOne
    @JoinColumn(name = "regiao_imediata_id")
    @JsonProperty("regiao-imediata")
    private RegiaoImediata regiaoImediata;

    public Microrregiao getMicrorregiao() {
        return microrregiao;
    }

    public void setMicrorregiao(Microrregiao microrregiao) {
        this.microrregiao = microrregiao;
    }

    public RegiaoImediata getRegiaoImediata() {
        return regiaoImediata;
    }

    public void setRegiaoImediata(RegiaoImediata regiaoImediata) {
        this.regiaoImediata = regiaoImediata;
    }
}
