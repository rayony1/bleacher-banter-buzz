// src/data/schools.ts
export type School = {
  id: string;
  name: string;
  district: string;
  state: string;
  colors: {
    primary: string;
    secondary: string;
  };
  mascot?: string;
};

export const schools: School[] = [
  {
    id: "whs-01",
    name: "Westview High School",
    district: "Poway Unified",
    state: "CA",
    colors: {
      primary: "#003366",
      secondary: "#FFD700"
    },
    mascot: "Wolverines"
  },
  {
    id: "mvhs-02",
    name: "Mountain View High",
    district: "Mountain View-Los Altos",
    state: "CA",
    colors: {
      primary: "#800000",
      secondary: "#FFD700"
    },
    mascot: "Spartans"
  },
  {
    id: "lhs-03",
    name: "Lincoln High School",
    district: "San Diego Unified",
    state: "CA",
    colors: {
      primary: "#00693E",
      secondary: "#FFFFFF"
    },
    mascot: "Hornets"
  },
  {
    id: "bhs-04",
    name: "Berkeley High School",
    district: "Berkeley Unified",
    state: "CA",
    colors: {
      primary: "#991111",
      secondary: "#FFCC00"
    },
    mascot: "Yellowjackets"
  },
  {
    id: "schs-05",
    name: "Santa Clara High",
    district: "Santa Clara Unified",
    state: "CA",
    colors: {
      primary: "#000080",
      secondary: "#FFFFFF"
    },
    mascot: "Bruins"
  },
  {
    id: "svhs-06",
    name: "Simi Valley High School",
    district: "Simi Valley Unified",
    state: "CA",
    colors: {
      primary: "#0000CD",
      secondary: "#FFFFFF"
    },
    mascot: "Pioneers"
  },
  {
    id: "mhs-07",
    name: "Mira Mesa High",
    district: "San Diego Unified",
    state: "CA",
    colors: {
      primary: "#191970",
      secondary: "#FFD700"
    },
    mascot: "Marauders"
  },
  {
    id: "rhs-08",
    name: "Redwood High School",
    district: "Tamalpais Union",
    state: "CA",
    colors: {
      primary: "#CC0000",
      secondary: "#000000"
    },
    mascot: "Giants"
  },
  {
    id: "pvhs-09",
    name: "Palos Verdes High",
    district: "Palos Verdes Peninsula Unified",
    state: "CA",
    colors: {
      primary: "#000080",
      secondary: "#C0C0C0"
    },
    mascot: "Sea Kings"
  },
  {
    id: "ths-10",
    name: "Torrey Pines High School",
    district: "San Dieguito Union",
    state: "CA",
    colors: {
      primary: "#006400",
      secondary: "#FFD700"
    },
    mascot: "Falcons"
  },
  {
    id: "gbhs-11",
    name: "Granite Bay High",
    district: "Roseville Joint Union",
    state: "CA",
    colors: {
      primary: "#003366",
      secondary: "#CC0000"
    },
    mascot: "Grizzlies"
  },
  {
    id: "sahs-12",
    name: "San Ramon Valley High",
    district: "San Ramon Valley Unified",
    state: "CA",
    colors: {
      primary: "#006400",
      secondary: "#FFFFFF"
    },
    mascot: "Wolves"
  },
  {
    id: "chs-13",
    name: "Carlsbad High School",
    district: "Carlsbad Unified",
    state: "CA",
    colors: {
      primary: "#800080",
      secondary: "#000000"
    },
    mascot: "Lancers"
  },
  {
    id: "fjhs-14",
    name: "Foothill High School",
    district: "Pleasanton Unified",
    state: "CA",
    colors: {
      primary: "#0000CD",
      secondary: "#FFFFFF"
    },
    mascot: "Falcons"
  },
  {
    id: "demo-school",
    name: "Demo School",
    district: "Demo District",
    state: "CA",
    colors: {
      primary: "#4CAF50",
      secondary: "#FFC107"
    },
    mascot: "Demo Team"
  }
];

// Helper function to get a school by ID
export const getSchoolById = (id: string): School | undefined => {
  return schools.find(school => school.id === id);
};

// Helper function to get school name by ID
export const getSchoolNameById = (id: string): string => {
  const school = getSchoolById(id);
  return school ? school.name : "Unknown School";
};
