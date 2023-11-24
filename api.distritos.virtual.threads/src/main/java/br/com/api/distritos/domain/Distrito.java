package br.com.api.distritos.domain;


import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Distrito extends BaseDomain {

    @ManyToOne
    @JoinColumn(name = "municipio_id")
    private Municipio municipio;

    public Municipio getMunicipio() {
        return municipio;
    }

    public void setMunicipio(Municipio municipio) {
        this.municipio = municipio;
    }


    @Override
    public String toString(){
        return String.format("nome: %s municipio: %s", getNome(), getMunicipio().getNome());
    }
}
