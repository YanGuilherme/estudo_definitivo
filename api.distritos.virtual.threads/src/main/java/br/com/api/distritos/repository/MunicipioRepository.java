package br.com.api.distritos.repository;

import br.com.api.distritos.domain.Municipio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MunicipioRepository extends JpaRepository<Municipio, Long> {
}
