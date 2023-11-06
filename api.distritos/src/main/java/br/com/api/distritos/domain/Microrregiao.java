package br.com.api.distritos.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Microrregiao extends BaseDomain{

    @ManyToOne
    @JoinColumn(name = "mesorregiao_id")
    private Mesorregiao mesorregiao;

    public Mesorregiao getMesorregiao() {
        return mesorregiao;
    }

    public void setMesorregiao(Mesorregiao mesorregiao) {
        this.mesorregiao = mesorregiao;
    }
}
