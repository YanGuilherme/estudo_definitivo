package br.com.api.distritos.repository;

import br.com.api.distritos.domain.UF;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UfRepository extends JpaRepository<UF, Long> {
}
