import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VendorService } from '../shared/services/vendor.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CustomValidatorsService } from '../shared/custom-validators.service';
import { LoaderService } from '../shared/services/loader.service';

@Component({
  selector: 'app-vendor-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatCardModule,],
  templateUrl: './vendor-form.component.html',
  styleUrl: './vendor-form.component.css'
})
export class VendorFormComponent implements OnInit {
  vendorForm!: FormGroup;
  vendorTypes: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];

  private dataFetchedCount = 0;
  private totalApiCalls = 2;
  private loaderStartTime!: number;

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private snackBar: MatSnackBar,
    private router: Router,
    private customValidators: CustomValidatorsService,
    private loaderService: LoaderService
  ) {
    loaderService.showLoader()
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadVendorTypes();
    this.loadCountries();
    this.loaderStartTime = Date.now();
  }


  incrementDataFetchedCount() {
    this.dataFetchedCount++;

    if (this.dataFetchedCount === this.totalApiCalls) {
      this.hideLoaderIfReady();
    }
  }

  hideLoaderIfReady() {
    const elapsedTime = Date.now() - this.loaderStartTime;

    if (elapsedTime >= 1000) {
      this.loaderService.hideLoader();
    } else {
      setTimeout(() => {
        this.loaderService.hideLoader();
      }, 1000 - elapsedTime);
    }
  }


  initializeForm() {
    this.vendorForm = this.fb.group({
      code: [{ value: 'Auto generated', disabled: true }],
      status: [true, Validators.required],
      vendorTypeId: [null, Validators.required],
      name: ['', [Validators.required, this.customValidators.noNumericValidator()]],
      email: ['', [Validators.email]],
      phoneNumber: ['', [this.customValidators.noAlphanumericValidator(), Validators.minLength(10), Validators.maxLength(10)]],
      gstNumber: [''],
      addressLine1: [''],
      addressLine2: [''],
      addressLine3: [''],
      countryId: [null],
      stateId: [null],
      cityId: [null],
      pinCode: ['', [Validators.pattern(/^\d{5,6}$/), this.customValidators.noAlphanumericValidator()]],
      remarks: ['']
    });
  }

  loadVendorTypes() {
    this.vendorService.getVendorTypes().subscribe(
      (data) => {
        (this.vendorTypes = data);
        this.incrementDataFetchedCount();
      },
      (error) => {
        console.error('Error loading vendor types', error)
        this.incrementDataFetchedCount();
      }
    );
  }

  loadCountries() {
    this.vendorService.getCountries().subscribe(
      (data) => {
        (this.countries = data)
        this.incrementDataFetchedCount();
      },
      (error) => {
        console.error('Error loading countries', error)
        this.incrementDataFetchedCount();
      }
    );
  }

  onCountryChange(countryId: number) {
    this.vendorService.getStates(countryId).subscribe(
      (data) => {
        (this.states = data)
      },
      (error) => {
        console.error('Error loading states', error)
      }
    );
    this.vendorForm.patchValue({ stateId: null, cityId: null });
  }

  onStateChange(stateId: number) {
    this.vendorService.getCities(stateId).subscribe(
      (data) => {
        (this.cities = data)
      },
      (error) => {
        console.error('Error loading cities', error)
      }
    );
    this.vendorForm.patchValue({ cityId: null });
  }

  onSubmit() {
    debugger
    if (this.vendorForm.valid) {
      const vendorData = this.vendorForm.getRawValue();
      this.vendorService.addVendor(vendorData).subscribe(
        () => {
          debugger
          this.snackBar.open('Vendor saved successfully!', 'Close', { duration: 3000 });
          // this.vendorForm.reset({ code: 'Auto generated', status: true });
          this.router.navigate(['/vendor-list'])
        },
        (error) => {
          console.error('Error saving vendor', error);
          this.snackBar.open('Error saving vendor!', 'Close', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Please fill in all required fields!', 'Close', { duration: 3000 });
    }
  }

  goBack() {
    this.router.navigate(['/vendor-list'])
  }

  toggleStatus(isActive: boolean) {
    this.vendorForm.patchValue({
      status: isActive
    });
  }

  clear() {
    this.vendorForm.reset({
      code: 'Auto generated',
      status: true,
    });

    Object.keys(this.vendorForm.controls).forEach(controlName => {
      const control = this.vendorForm.get(controlName);
      if (control) {
        control.markAsPristine();
        control.markAsUntouched();
        control.setErrors(null);
      }
    });
  }




}
