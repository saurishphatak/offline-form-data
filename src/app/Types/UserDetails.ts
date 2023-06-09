import { City } from "./City";
import { State } from "./State";

export type UserDetails = {
  applicationId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  gender: string;
  state: State;
  city: City;
  status: string;
  age: number;
}
