package be.an.stewy.stewyapi.service;

import be.an.stewy.stewyapi.ClubStatus;
import be.an.stewy.stewyapi.domain.Club;
import be.an.stewy.stewyapi.domain.Volunteer;
import be.an.stewy.stewyapi.exception.CustomException;
import be.an.stewy.stewyapi.mapper.VolunteerProfileResponseDto;
import be.an.stewy.stewyapi.mapper.VolunteerMapper;
import be.an.stewy.stewyapi.repository.ClubRepository;
import be.an.stewy.stewyapi.repository.VolunteerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true, rollbackFor = Exception.class)
public class ClubMembershipService {

    private final VolunteerRepository volunteerRepository;
    private final ClubRepository clubRepository;
    private final VolunteerMapper volunteerMapper;

    public ClubMembershipService(VolunteerRepository volunteerRepository,
                                  ClubRepository clubRepository,
                                  VolunteerMapper volunteerMapper) {
        this.volunteerRepository = volunteerRepository;
        this.clubRepository = clubRepository;
        this.volunteerMapper = volunteerMapper;
    }

    @Transactional
    public VolunteerProfileResponseDto approveByHoofdSteward(UUID clubId, UUID volunteerId) {
        Volunteer volunteer = volunteerRepository.findByVolunteerId(volunteerId);
        if (volunteer == null) {
            throw new CustomException("Volunteer not found");
        }
        if (volunteer.getClub() == null || !volunteer.getClub().getId().equals(clubId)) {
            throw new CustomException("Volunteer is not a member of this club");
        }
        if (volunteer.getClubStatus() != ClubStatus.PENDING) {
            throw new CustomException("Club membership is not pending");
        }
        volunteer.setClubStatus(ClubStatus.APPROVED);
        volunteerRepository.update(volunteer);
        return volunteerMapper.mapVolunteerToProfileResponse(volunteer);
    }

    @Transactional
    public VolunteerProfileResponseDto rejectByHoofdSteward(UUID clubId, UUID volunteerId) {
        Volunteer volunteer = volunteerRepository.findByVolunteerId(volunteerId);
        if (volunteer == null) {
            throw new CustomException("Volunteer not found");
        }
        if (volunteer.getClub() == null || !volunteer.getClub().getId().equals(clubId)) {
            throw new CustomException("Volunteer is not a member of this club");
        }
        volunteer.setClubStatus(ClubStatus.REJECTED);
        volunteerRepository.update(volunteer);
        return volunteerMapper.mapVolunteerToProfileResponse(volunteer);
    }

    public List<VolunteerProfileResponseDto> getApprovedClubMembers(UUID clubId) {
        return volunteerRepository.findByClubId(clubId).stream()
                .filter(v -> v.getClubStatus() == ClubStatus.APPROVED)
                .map(volunteerMapper::mapVolunteerToProfileResponse)
                .toList();
    }

    public List<VolunteerProfileResponseDto> getPendingMembers(UUID clubId) {
        return volunteerRepository.findByClubIdAndClubStatus(clubId, "PENDING").stream()
                .map(volunteerMapper::mapVolunteerToProfileResponse)
                .toList();
    }
}
