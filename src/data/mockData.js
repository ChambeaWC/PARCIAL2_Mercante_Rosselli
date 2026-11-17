const initialUsers = [
  { id: 1, username: "admin", password: "123", role: "trainer", name: "Mercante" },
  { id: 2, username: "socio", password: "123", role: "member", name: "Galo" }
];

const initialExercises = [
  { id: 201, name: "Press de Banca plano" },
  { id: 202, name: "Press Inclinado" },
  { id: 203, name: "Press de Hombros" },
  { id: 204, name: "Jalones al Pecho" },
  { id: 205, name: "Remo en máquina" },
  { id: 206, name: "Sentadillas" },
  { id: 207, name: "Peso Muerto" }
];

const initialRoutines = [
  {
    userId: 2,
    week: 1,
    day: "Lunes",
    exercises: [
      { id: 101, name: "Press de Banca plano", sets: 4, reps: 10, weight: 60, completed: false, actualWeight: null }
    ]
  }
];

export const getAppUsers = () => JSON.parse(localStorage.getItem('appUsers')) || initialUsers;
export const saveAppUsers = (data) => localStorage.setItem('appUsers', JSON.stringify(data));

export const getAppRoutines = () => JSON.parse(localStorage.getItem('appRoutines')) || initialRoutines;
export const saveAppRoutines = (data) => localStorage.setItem('appRoutines', JSON.stringify(data));

export const getAppCatalog = () => JSON.parse(localStorage.getItem('appCatalog')) || initialExercises;
export const saveAppCatalog = (data) => localStorage.setItem('appCatalog', JSON.stringify(data));