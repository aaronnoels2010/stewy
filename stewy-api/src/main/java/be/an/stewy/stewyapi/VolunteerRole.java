package be.an.stewy.stewyapi;

public enum VolunteerRole {
    HOOFD_STEWARD("HS"),
    DEVISIE_CHEF("DC"),
    STEWARD("ST");

    VolunteerRole(String name){
        this.name = name;
    }

    private final String name;

    public String getName() {
        return name;
    }

    public static VolunteerRole mapStringToVolunteerRole(String s) {
        for (VolunteerRole role : VolunteerRole.values()) {
            if (role.getName().equalsIgnoreCase(s)) {
                return role;
            }
        }
        throw new IllegalArgumentException("No enum constant for value: " + s);
    }

}
