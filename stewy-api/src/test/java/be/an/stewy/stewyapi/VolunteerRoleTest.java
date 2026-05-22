package be.an.stewy.stewyapi;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class VolunteerRoleTest {

    @Test
    void mapStringToVolunteerRole_acceptsEnumNameHoofdSteward() {
        assertEquals(VolunteerRole.HOOFD_STEWARD, VolunteerRole.mapStringToVolunteerRole("HOOFD_STEWARD"));
    }

    @Test
    void mapStringToVolunteerRole_acceptsEnumNameDevisieChef() {
        assertEquals(VolunteerRole.DEVISIE_CHEF, VolunteerRole.mapStringToVolunteerRole("DEVISIE_CHEF"));
    }

    @Test
    void mapStringToVolunteerRole_acceptsEnumNameSteward() {
        assertEquals(VolunteerRole.STEWARD, VolunteerRole.mapStringToVolunteerRole("STEWARD"));
    }

    @Test
    void mapStringToVolunteerRole_acceptsInternalCodeHS() {
        assertEquals(VolunteerRole.HOOFD_STEWARD, VolunteerRole.mapStringToVolunteerRole("HS"));
    }

    @Test
    void mapStringToVolunteerRole_acceptsInternalCodeDC() {
        assertEquals(VolunteerRole.DEVISIE_CHEF, VolunteerRole.mapStringToVolunteerRole("DC"));
    }

    @Test
    void mapStringToVolunteerRole_acceptsInternalCodeST() {
        assertEquals(VolunteerRole.STEWARD, VolunteerRole.mapStringToVolunteerRole("ST"));
    }

    @Test
    void mapStringToVolunteerRole_isCaseInsensitive() {
        assertEquals(VolunteerRole.HOOFD_STEWARD, VolunteerRole.mapStringToVolunteerRole("hoofd_steward"));
        assertEquals(VolunteerRole.STEWARD, VolunteerRole.mapStringToVolunteerRole("steward"));
        assertEquals(VolunteerRole.HOOFD_STEWARD, VolunteerRole.mapStringToVolunteerRole("hs"));
    }

    @Test
    void mapStringToVolunteerRole_throwsForInvalidValue() {
        assertThrows(IllegalArgumentException.class,
                () -> VolunteerRole.mapStringToVolunteerRole("INVALID_ROLE"));
    }
}
