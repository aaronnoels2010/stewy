package be.an.stewy.stewyapi.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "volunteer_game")
@Getter
@Setter
public class VolunteerGame {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "volunteer_id")
    private UUID volunteerId;
    @Column(name = "game_id")
    private UUID gameId;
}
