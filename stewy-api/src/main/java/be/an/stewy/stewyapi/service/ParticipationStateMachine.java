package be.an.stewy.stewyapi.service;

import be.an.stewy.stewyapi.ParticipationStatus;

public class ParticipationStateMachine {

    public enum Action {
        APPROVE,
        REJECT,
        ACCEPT,
        DECLINE,
        CANCEL,
        WITHDRAW
    }

    public enum Actor {
        HOOFD_STEWARD,
        VOLUNTEER
    }

    public static ParticipationStatus transition(
            ParticipationStatus currentStatus,
            Action action,
            Actor actor,
            boolean isBeforeDeadline) {
        return switch (currentStatus) {
            case REQUESTED -> switch (action) {
                case APPROVE -> {
                    if (actor != Actor.HOOFD_STEWARD)
                        throw new IllegalStateException("Only hoofd steward can approve requests");
                    yield ParticipationStatus.APPROVED;
                }
                case REJECT -> {
                    if (actor != Actor.HOOFD_STEWARD)
                        throw new IllegalStateException("Only hoofd steward can reject requests");
                    yield ParticipationStatus.REJECTED;
                }
                default -> throw new IllegalStateException(
                        "Cannot " + action + " a REQUESTED participation");
            };
            case INVITED -> switch (action) {
                case ACCEPT -> {
                    if (actor != Actor.VOLUNTEER)
                        throw new IllegalStateException("Only the volunteer can accept an invitation");
                    yield ParticipationStatus.APPROVED;
                }
                case DECLINE -> {
                    if (actor != Actor.VOLUNTEER)
                        throw new IllegalStateException("Only the volunteer can decline an invitation");
                    yield ParticipationStatus.REJECTED;
                }
                default -> throw new IllegalStateException(
                        "Cannot " + action + " an INVITED participation");
            };
            case APPROVED -> switch (action) {
                case CANCEL -> {
                    if (actor != Actor.HOOFD_STEWARD)
                        throw new IllegalStateException("Only hoofd steward can cancel participation");
                    yield ParticipationStatus.CANCELLED;
                }
                case WITHDRAW -> {
                    if (actor != Actor.VOLUNTEER)
                        throw new IllegalStateException("Only the volunteer can withdraw");
                    if (!isBeforeDeadline)
                        throw new IllegalStateException("Cannot withdraw after the deadline");
                    yield ParticipationStatus.WITHDRAWN;
                }
                default -> throw new IllegalStateException(
                        "Cannot " + action + " an APPROVED participation");
            };
            case REJECTED, CANCELLED, WITHDRAWN -> throw new IllegalStateException(
                    "Cannot transition from a terminal state: " + currentStatus);
        };
    }

    public static boolean isValidTransition(ParticipationStatus current, Action action, Actor actor, boolean isBeforeDeadline) {
        try {
            transition(current, action, actor, isBeforeDeadline);
            return true;
        } catch (IllegalStateException e) {
            return false;
        }
    }
}
