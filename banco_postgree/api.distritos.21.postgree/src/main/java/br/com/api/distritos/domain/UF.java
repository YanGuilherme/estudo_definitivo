package br.com.api.distritos.domain;


import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class UF extends BaseDomain {

    private String sigla;

    @ManyToOne
    @JoinColumn(name = "regiao_id")
    private Regiao regiao;

    public String getSigla() {
        return sigla;
    }

    public Regiao getRegiao() {
        return regiao;
    }

    public void setSigla(String sigla) {
        this.sigla = sigla;
    }

    public void setRegiao(Regiao regiao) {
        this.regiao = regiao;
    }
}
