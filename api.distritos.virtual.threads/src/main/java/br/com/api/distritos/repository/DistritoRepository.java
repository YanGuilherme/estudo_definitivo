package br.com.api.distritos.repository;

import br.com.api.distritos.domain.Distrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DistritoRepository extends JpaRepository<Distrito, Long> {

    @Query("select count(*) > 0 from Distrito")
    boolean existAnyRecord();

}
