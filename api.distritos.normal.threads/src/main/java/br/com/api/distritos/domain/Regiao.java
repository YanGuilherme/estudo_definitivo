package br.com.api.distritos.domain;


import jakarta.persistence.Entity;

@Entity
public class Regiao extends BaseDomain {

    private String sigla;

    public String getSigla() {
        return sigla;
    }

    public void setSigla(String sigla) {
        this.sigla = sigla;
    }
}
