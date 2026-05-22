package be.an.stewy.stewyapi.service;

import be.an.stewy.stewyapi.ParticipationStatus;
import be.an.stewy.stewyapi.service.ParticipationStateMachine.Action;
import be.an.stewy.stewyapi.service.ParticipationStateMachine.Actor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

class ParticipationStateMachineTest {

    static Stream<Arguments> validTransitions() {
        return Stream.of(
                Arguments.of(ParticipationStatus.REQUESTED, Action.APPROVE, Actor.HOOFD_STEWARD, true, ParticipationStatus.APPROVED),
                Arguments.of(ParticipationStatus.REQUESTED, Action.REJECT, Actor.HOOFD_STEWARD, true, ParticipationStatus.REJECTED),
                Arguments.of(ParticipationStatus.INVITED, Action.ACCEPT, Actor.VOLUNTEER, true, ParticipationStatus.APPROVED),
                Arguments.of(ParticipationStatus.INVITED, Action.DECLINE, Actor.VOLUNTEER, true, ParticipationStatus.REJECTED),
                Arguments.of(ParticipationStatus.APPROVED, Action.CANCEL, Actor.HOOFD_STEWARD, true, ParticipationStatus.CANCELLED),
                Arguments.of(ParticipationStatus.APPROVED, Action.CANCEL, Actor.HOOFD_STEWARD, false, ParticipationStatus.CANCELLED),
                Arguments.of(ParticipationStatus.APPROVED, Action.WITHDRAW, Actor.VOLUNTEER, true, ParticipationStatus.WITHDRAWN)
        );
    }

    @ParameterizedTest
    @MethodSource("validTransitions")
    void validTransitions_succeed(ParticipationStatus current, Action action, Actor actor, boolean isBeforeDeadline, ParticipationStatus expected) {
        assertEquals(expected, ParticipationStateMachine.transition(current, action, actor, isBeforeDeadline));
    }

    static Stream<Arguments> invalidTransitions() {
        return Stream.of(
                // REQUESTED - only hoofd steward can act
                Arguments.of(ParticipationStatus.REQUESTED, Action.APPROVE, Actor.VOLUNTEER, true, "Only hoofd steward"),
                Arguments.of(ParticipationStatus.REQUESTED, Action.REJECT, Actor.VOLUNTEER, true, "Only hoofd steward"),
                Arguments.of(ParticipationStatus.REQUESTED, Action.ACCEPT, Actor.VOLUNTEER, true, "Cannot ACCEPT a REQUESTED"),
                Arguments.of(ParticipationStatus.REQUESTED, Action.DECLINE, Actor.VOLUNTEER, true, "Cannot DECLINE a REQUESTED"),
                Arguments.of(ParticipationStatus.REQUESTED, Action.CANCEL, Actor.HOOFD_STEWARD, true, "Cannot CANCEL a REQUESTED"),
                Arguments.of(ParticipationStatus.REQUESTED, Action.WITHDRAW, Actor.VOLUNTEER, true, "Cannot WITHDRAW a REQUESTED"),

                // INVITED - only volunteer can act
                Arguments.of(ParticipationStatus.INVITED, Action.ACCEPT, Actor.HOOFD_STEWARD, true, "Only the volunteer"),
                Arguments.of(ParticipationStatus.INVITED, Action.DECLINE, Actor.HOOFD_STEWARD, true, "Only the volunteer"),
                Arguments.of(ParticipationStatus.INVITED, Action.APPROVE, Actor.HOOFD_STEWARD, true, "Cannot APPROVE an INVITED"),
                Arguments.of(ParticipationStatus.INVITED, Action.REJECT, Actor.HOOFD_STEWARD, true, "Cannot REJECT an INVITED"),
                Arguments.of(ParticipationStatus.INVITED, Action.CANCEL, Actor.HOOFD_STEWARD, true, "Cannot CANCEL an INVITED"),
                Arguments.of(ParticipationStatus.INVITED, Action.WITHDRAW, Actor.VOLUNTEER, true, "Cannot WITHDRAW an INVITED"),

                // APPROVED
                Arguments.of(ParticipationStatus.APPROVED, Action.CANCEL, Actor.VOLUNTEER, true, "Only hoofd steward"),
                Arguments.of(ParticipationStatus.APPROVED, Action.WITHDRAW, Actor.HOOFD_STEWARD, true, "Only the volunteer"),
                Arguments.of(ParticipationStatus.APPROVED, Action.WITHDRAW, Actor.VOLUNTEER, false, "Cannot withdraw after the deadline"),
                Arguments.of(ParticipationStatus.APPROVED, Action.APPROVE, Actor.HOOFD_STEWARD, true, "Cannot APPROVE an APPROVED"),
                Arguments.of(ParticipationStatus.APPROVED, Action.REJECT, Actor.HOOFD_STEWARD, true, "Cannot REJECT an APPROVED"),
                Arguments.of(ParticipationStatus.APPROVED, Action.ACCEPT, Actor.VOLUNTEER, true, "Cannot ACCEPT an APPROVED"),
                Arguments.of(ParticipationStatus.APPROVED, Action.DECLINE, Actor.VOLUNTEER, true, "Cannot DECLINE an APPROVED"),

                // Terminal states
                Arguments.of(ParticipationStatus.REJECTED, Action.APPROVE, Actor.HOOFD_STEWARD, true, "terminal state"),
                Arguments.of(ParticipationStatus.CANCELLED, Action.APPROVE, Actor.HOOFD_STEWARD, true, "terminal state"),
                Arguments.of(ParticipationStatus.WITHDRAWN, Action.APPROVE, Actor.HOOFD_STEWARD, true, "terminal state")
        );
    }

    @ParameterizedTest
    @MethodSource("invalidTransitions")
    void invalidTransitions_throwIllegalStateException(ParticipationStatus current, Action action, Actor actor, boolean isBeforeDeadline, String expectedMessage) {
        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> ParticipationStateMachine.transition(current, action, actor, isBeforeDeadline));
        assertTrue(ex.getMessage().contains(expectedMessage),
                "Expected message containing '" + expectedMessage + "' but got: " + ex.getMessage());
    }

    @Test
    void withdrawAfterDeadline_throws() {
        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> ParticipationStateMachine.transition(ParticipationStatus.APPROVED, Action.WITHDRAW, Actor.VOLUNTEER, false));
        assertTrue(ex.getMessage().contains("Cannot withdraw after the deadline"));
    }

    @Test
    void cancelAnytime_succeeds_evenAfterDeadline() {
        assertEquals(ParticipationStatus.CANCELLED,
                ParticipationStateMachine.transition(ParticipationStatus.APPROVED, Action.CANCEL, Actor.HOOFD_STEWARD, false));
    }

    @Test
    void isValidTransition_returnsTrueForValid() {
        assertTrue(ParticipationStateMachine.isValidTransition(ParticipationStatus.REQUESTED, Action.APPROVE, Actor.HOOFD_STEWARD, true));
    }

    @Test
    void isValidTransition_returnsFalseForInvalid() {
        assertFalse(ParticipationStateMachine.isValidTransition(ParticipationStatus.REQUESTED, Action.APPROVE, Actor.VOLUNTEER, true));
    }

    @Test
    void isValidTransition_returnsFalseForDeadlineGate() {
        assertFalse(ParticipationStateMachine.isValidTransition(ParticipationStatus.APPROVED, Action.WITHDRAW, Actor.VOLUNTEER, false));
    }
}
