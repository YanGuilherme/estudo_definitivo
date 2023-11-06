package br.com.api.distritos.repository;

import br.com.api.distritos.domain.Distrito;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DistritoRepository extends JpaRepository<Distrito, Long> {

}
