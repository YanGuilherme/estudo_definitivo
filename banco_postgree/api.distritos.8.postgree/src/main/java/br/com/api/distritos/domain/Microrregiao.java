package br.com.api.distritos.domain;


import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

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
