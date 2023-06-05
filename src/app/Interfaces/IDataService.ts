export interface IDataService {
  getStates(): any;

  getCitiesByState(state: string): any;

  submitFormData(formData: any): any;
}
