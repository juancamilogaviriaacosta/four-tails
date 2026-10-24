package co.com.ftails.be.services;

import co.com.ftails.be.dtos.KindOfPetDto;
import co.com.ftails.be.entities.KindOfPet;
import co.com.ftails.be.repositories.KindOfPetRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class KindOfPetService {

    private final KindOfPetRepository kr;

    public List<KindOfPetDto> getKindOfPets() {
        List<KindOfPet> all = kr.findAll();
        List<KindOfPetDto> response = new ArrayList<>();
        for (KindOfPet tmp : all) {
            KindOfPetDto dto = new KindOfPetDto();
            dto.setId(tmp.getId());
            dto.setName(tmp.getName());
            response.add(dto);
        }
        return response;
    }
}
