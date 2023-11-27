package br.com.api.distritos.controller;


import br.com.api.distritos.domain.*;
import br.com.api.distritos.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
public class DistritoController {

    @Autowired
    private DistritoRepository distritoRepository;

    @Autowired
    private MunicipioRepository municipioRepository;

    @Autowired
    private MicrorregiaoRepository microrregiaoRepository;

    @Autowired
    private RegiaoImediataRepository regiaoImediataRepository;

    @Autowired
    private RegiaoIntermediariaRepository regiaoIntermediariaRepository;

    @Autowired
    private MesorregiaoRepository mesorregiaoRepository;

    @Autowired
    private UfRepository ufRepository;

    @Autowired
    private RegiaoRepository regiaoRepository;

    private final Logger log = LoggerFactory.getLogger(DistritoController.class);

    @GetMapping("/processamento")
    public ResponseEntity<String> processamento1Segundo() throws InterruptedException {
        log.info(Thread.currentThread().toString());
        Thread.sleep(1000);
        return ResponseEntity.status(200).body(Thread.currentThread().toString());
    }

    @GetMapping("/distritos")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Distrito>> listAll() {
        return ResponseEntity.status(200).body(distritoRepository.findAll());
    }

    @GetMapping("/distritoAleatorio")
    @Transactional(readOnly = true)
    public ResponseEntity<Distrito> getRandom(@RequestParam(name = "id") Long id) {
        return ResponseEntity.status(200).body(distritoRepository.findById(id).orElseThrow());
    }

    @PostMapping("/setup")
    public ResponseEntity<List<Long>> setup() {
        try {
            if (distritoRepository.existAnyRecord()) {
                return ResponseEntity.status(200)
                        .header("version", Thread.currentThread().isVirtual() ? "virtual_threads" : "normal_threads" )
                        .body(distritoRepository.findAll().stream().map(BaseDomain::getId).collect(Collectors.toList()));
            }
            popularBanco();
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.status(400)
                    .header("version", Thread.currentThread().isVirtual() ? "virtual_threads" : "normal_threads")
                    .body(new ArrayList<>());
        }
        return ResponseEntity.status(200)
                .header("version", Thread.currentThread().isVirtual() ? "virtual_threads" : "normal_threads")
                .body(distritoRepository.findAll().stream().map(BaseDomain::getId).collect(Collectors.toList()));
    }

    private void popularBanco() throws IOException {
            // URL da API do IBGE
            String url = "https://servicodados.ibge.gov.br/api/v1/localidades/distritos";

            // Cria uma conexão HTTP
            HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();

            // Define o método de requisição como GET
            connection.setRequestMethod("GET");

            // Configura a propriedade para aceitar resposta JSON
            connection.setRequestProperty("Accept", "application/json");

            // Cria um ObjectMapper do Jackson
            ObjectMapper objectMapper = new ObjectMapper();

            // Lê a resposta da API e mapeia para uma lista de objetos Distrito
            List<Distrito> distritos = objectMapper.readValue(connection.getInputStream(), new TypeReference<>() {});
            Set<Municipio> municipios = distritos.stream().map(Distrito::getMunicipio).collect(Collectors.toSet());

            Set<Microrregiao> microrregioes = municipios.stream().map(Municipio::getMicrorregiao).collect(Collectors.toSet());
            Set<Mesorregiao> mesorregioes = microrregioes.stream().map(Microrregiao::getMesorregiao).collect(Collectors.toSet());

            Set<RegiaoImediata> regiaoImediatas = municipios.stream().map(Municipio::getRegiaoImediata).collect(Collectors.toSet());
            Set<RegiaoIntermediaria> regioesIntermediarias = regiaoImediatas.stream().map(RegiaoImediata::getRegiaoIntermediaria).collect(Collectors.toSet());

            Set<UF> ufs = Stream.concat(
                    mesorregioes.stream().map(Mesorregiao::getUf),
                    regioesIntermediarias.stream().map(RegiaoIntermediaria::getUf)
            ).collect(Collectors.toSet());

            Set<Regiao> regioes = ufs.stream().map(UF::getRegiao).collect(Collectors.toSet());

            regiaoRepository.saveAll(regioes);
            ufRepository.saveAll(ufs);

            mesorregiaoRepository.saveAll(mesorregioes);
            regiaoIntermediariaRepository.saveAll(regioesIntermediarias);

            microrregiaoRepository.saveAll(microrregioes);
            regiaoImediataRepository.saveAll(regiaoImediatas);

            municipioRepository.saveAll(municipios);
            distritoRepository.saveAll(distritos);

            // Fecha a conexão
            connection.disconnect();

    }

}
