package br.com.api.distritos.repository;

import br.com.api.distritos.domain.Regiao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegiaoRepository extends JpaRepository<Regiao, Long> {
}
