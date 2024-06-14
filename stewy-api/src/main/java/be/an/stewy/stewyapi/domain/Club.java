package be.an.stewy.stewyapi.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "td_club")
@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
public class Club {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "club_name")
    private String clubName;
    @OneToOne
    private Volunteer responsible;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL)
    private List<Volunteer> volunteerList;

    @Column(name = "parking_instructions")
    private String parkingInstructions;

    @OneToMany(mappedBy = "homeTeam")
    private List<Game> homeGames;

    @OneToMany(mappedBy = "awayTeam")
    private List<Game> awayGames;



    public Club() {

    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Club club)) return false;
        return Objects.equals(getId(), club.getId()) && Objects.equals(getClubName(), club.getClubName()) && Objects.equals(getResponsible(), club.getResponsible());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getClubName(), getResponsible());
    }
}
