package be.an.stewy.stewyapi.domain;

import be.an.stewy.stewyapi.VolunteerRole;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "td_volunteer")
@Getter
@Setter
@Builder
@AllArgsConstructor
@ToString
public class Volunteer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "volunteer_role")
    private VolunteerRole role;

    @ManyToOne
    @JoinColumn(name="club_id")
    private Club club;

    @Column(name = "kbvb_id")
    private String kbvbId;
    @ManyToMany
    @JoinTable(
            name = "volunteer_game",
            joinColumns = @JoinColumn(name = "volunteer_id"),
            inverseJoinColumns = @JoinColumn(name = "game_id")
    )
    private List<Game> games;


    public Volunteer() {

    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Volunteer volunteer)) return false;
        return Objects.equals(getId(), volunteer.getId()) && Objects.equals(getFirstName(), volunteer.getFirstName()) && Objects.equals(getLastName(), volunteer.getLastName());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getFirstName(), getLastName());
    }
}
