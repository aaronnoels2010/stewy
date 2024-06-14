package be.an.stewy.stewyapi.domain;

import be.an.stewy.stewyapi.GameStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "td_game")
@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne
    @JoinColumn(name = "home_team_id")
    private Club homeTeam;

    @ManyToOne
    @JoinColumn(name = "away_team_id")
    private Club awayTeam;

    private ZonedDateTime appointment;
    private ZonedDateTime deadline;

    @Enumerated(value = EnumType.STRING)
    private GameStatus status;

    @ManyToMany(mappedBy = "games")
    private List<Volunteer> participants;

    @ManyToOne
    @JoinColumn(name = "volunteer_id")
    private Volunteer responsible;

    public Game() {}
}
