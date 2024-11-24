import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { VendorService } from '../shared/services/vendor.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { LoaderService } from '../shared/services/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-vendor-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatSortModule],
  templateUrl: './vendor-list.component.html',
  styleUrl: './vendor-list.component.css'
})
export class VendorListComponent implements OnInit,AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  vendors = new MatTableDataSource<any>();

  private dataFetchedCount = 0;
  private totalApiCalls = 1;
  private loaderStartTime!: number;

  displayedColumns: string[] = ['vendorCode', 'name', 'vendorType', 'phone', 'email', 'status', 'actions'];

  constructor(private vendorService: VendorService, private router: Router, private loaderService: LoaderService, private snackBar: MatSnackBar,) {
    this.loaderService.showLoader();
  }

  ngOnInit(): void {
    this.loadVendors();
    
    this.loaderStartTime = Date.now();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.vendors.paginator = this.paginator;
    this.vendors.sort = this.sort;
    this.applyCustomSorting();
    }, 1000);
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

  loadVendors(): void {
    this.vendorService.getVendors().subscribe(
      (data) => {
        this.vendors.data = data;
        this.vendors.paginator = this.paginator;
        this.vendors.sort = this.sort;
        console.log(this.vendors.data);
        this.incrementDataFetchedCount();
      },
      (error) => {
        this.incrementDataFetchedCount();
        console.error('Error fetching vendor list:', error);
        this.snackBar.open('Error fetching vendor list!', 'Close', { duration: 3000 });
      }
    );
  }

  goTORegistration() {
    this.router.navigate(['/vendor-registration']);
  }
  applyCustomSorting(): void {
    this.vendors.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'vendorCode':
          return item.code || ''; 
        case 'name':
          return item.name?.toLowerCase() || ''; 
        case 'vendorType':
          return item.vendorType?.type?.toLowerCase() || ''; 
        case 'status':
          return item.status ? 'Active' : 'Inactive'; 
        default:
          return item[property] || ''; 
      }
    };
  }
  


  onDeleteVendor(vendorId: any): void {
    console.log(vendorId);

    if (confirm('Are you sure you want to delete this vendor?') && vendorId > 0) {
      this.vendorService.deleteVendor(vendorId).subscribe(
        response => {
          this.snackBar.open('Vendor deleted successfully', 'Close', { duration: 3000 });
          this.loadVendors();
        },
        error => {
          console.error('Error deleting vendor:', error);
          this.snackBar.open('An error occurred while deleting the vendor', 'Close', { duration: 3000 });
        }
      );
    }
  }

}

