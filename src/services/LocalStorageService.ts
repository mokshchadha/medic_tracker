// services/LocalStorageService.ts
import { Patient, Medicine } from '../types';

class LocalStorageService {
  private static readonly PATIENTS_KEY = 'medic_tracker_patients';
  private static readonly MEDICINES_KEY = 'medic_tracker_medicines';

  // Patient methods
  static getPatients(): Patient[] {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const patientsJson = localStorage.getItem(this.PATIENTS_KEY);
      return patientsJson ? JSON.parse(patientsJson) : [];
    } catch (error) {
      console.error('Error loading patients from localStorage:', error);
      return [];
    }
  }

  static savePatients(patients: Patient[]): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.PATIENTS_KEY, JSON.stringify(patients));
    } catch (error) {
      console.error('Error saving patients to localStorage:', error);
    }
  }

  static addPatient(patient: Patient): void {
    const patients = this.getPatients();
    patients.push(patient);
    this.savePatients(patients);
  }

  static updatePatient(updatedPatient: Patient): void {
    const patients = this.getPatients();
    const updatedPatients = patients.map(p => 
      p.id === updatedPatient.id ? updatedPatient : p
    );
    this.savePatients(updatedPatients);
  }

  static deletePatient(patientId: number): void {
    const patients = this.getPatients();
    const filteredPatients = patients.filter(p => p.id !== patientId);
    this.savePatients(filteredPatients);
  }

  // Medicine methods
  static getMedicines(): Medicine[] {
    if (typeof window === 'undefined') {
      return this.getDefaultMedicines();
    }

    try {
      const medicinesJson = localStorage.getItem(this.MEDICINES_KEY);
      return medicinesJson ? JSON.parse(medicinesJson) : this.getDefaultMedicines();
    } catch (error) {
      console.error('Error loading medicines from localStorage:', error);
      return this.getDefaultMedicines();
    }
  }

  static saveMedicines(medicines: Medicine[]): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.MEDICINES_KEY, JSON.stringify(medicines));
    } catch (error) {
      console.error('Error saving medicines to localStorage:', error);
    }
  }

  static addMedicine(medicine: Medicine): void {
    const medicines = this.getMedicines();
    medicines.push(medicine);
    this.saveMedicines(medicines);
  }

  static deleteMedicine(medicineId: number): void {
    const medicines = this.getMedicines();
    const filteredMedicines = medicines.filter(m => m.id !== medicineId);
    this.saveMedicines(filteredMedicines);
  }

  // Default medicines for first-time users
  private static getDefaultMedicines(): Medicine[] {
    const defaultMedicines = [
      { id: 1, name: 'Paracetamol', defaultDosage: '500mg' },
      { id: 2, name: 'Aspirin', defaultDosage: '75mg' },
      { id: 3, name: 'Ibuprofen', defaultDosage: '400mg' },
      { id: 4, name: 'Amoxicillin', defaultDosage: '250mg' },
      { id: 5, name: 'Metformin', defaultDosage: '500mg' },
      { id: 6, name: 'Lisinopril', defaultDosage: '10mg' },
      { id: 7, name: 'Atorvastatin', defaultDosage: '20mg' },
      { id: 8, name: 'Omeprazole', defaultDosage: '20mg' }
    ];
    
    // Save default medicines to localStorage if in browser and not already saved
    if (typeof window !== 'undefined') {
      try {
        const existing = localStorage.getItem(this.MEDICINES_KEY);
        if (!existing) {
          this.saveMedicines(defaultMedicines);
        }
      } catch (error) {
        console.error('Error saving default medicines:', error);
      }
    }
    
    return defaultMedicines;
  }

  // Utility methods
  static clearAllData(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.removeItem(this.PATIENTS_KEY);
      localStorage.removeItem(this.MEDICINES_KEY);
    } catch (error) {
      console.error('Error clearing localStorage data:', error);
    }
  }

  static exportData(): { patients: Patient[]; medicines: Medicine[] } {
    return {
      patients: this.getPatients(),
      medicines: this.getMedicines()
    };
  }

  static importData(data: { patients: Patient[]; medicines: Medicine[] }): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      if (data.patients) {
        this.savePatients(data.patients);
      }
      if (data.medicines) {
        this.saveMedicines(data.medicines);
      }
    } catch (error) {
      console.error('Error importing data:', error);
    }
  }

  // Check if localStorage is available
  static isLocalStorageAvailable(): boolean {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      console.warn('localStorage is not available:', error);
      return false;
    }
  }
}

export default LocalStorageService;