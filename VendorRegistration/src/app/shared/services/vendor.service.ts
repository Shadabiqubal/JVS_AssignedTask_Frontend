import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  // private apiUrl = 'https://localhost:7196/api/';
  private apiUrl = environment.ApiUrl;
  
  constructor(private http: HttpClient) { }

  getCountries(): Observable<any[]>  {
    return this.http.get<any[]>(this.apiUrl+'Master/GetCountries');
  }
  getStates(countryId:any): Observable<any[]>  {
    return this.http.get<any[]>(this.apiUrl+'Master/GetStates/'+countryId);
  }
  getCities(stateId:any): Observable<any[]>  {
    return this.http.get<any[]>(this.apiUrl+'Master/GetCities/'+stateId);
  }
  getVendorTypes(): Observable<any[]>  {
    return this.http.get<any[]>(this.apiUrl+'Master/GetVendorTypes');
  }

  getVendors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'Vendor/GetVendors');
  }

  addVendor(vendor: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'Vendor/SaveVendor', vendor);
  }
  deleteVendor(vendorId: any): Observable<any> {
    debugger
    return this.http.delete<any>(this.apiUrl+'Vendor/DeleteVendor?vendorId='+vendorId);
  }
}
