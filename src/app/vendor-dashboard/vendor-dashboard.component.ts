import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AppServiceService } from '../app-service.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environment';


@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSelectModule, MatCheckboxModule, FormsModule, ReactiveFormsModule],
  templateUrl: './vendor-dashboard.component.html',
  styleUrl: './vendor-dashboard.component.css'
})
export class VendorDashboardComponent {
  currentView: string = 'storage';

  //pending
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  displayedColumns: any = ['orderBy', 'address', 'type', 'price', 'quantity', 'size', 'status', 'preview'];
  displayedColumnsforprinting: any = ['sideTag', 'quantity', 'size', 'print', 'preview', 'status'];
  orderData: any = [];
  dataSource: any = new MatTableDataSource<any>(this.orderData);
  showAddElementModal: boolean = false;
  currentRow: any;
  updatedStatus: any;
  previewTeeData: any = '';
  currentSide: any = 'front';
  //pending <><><>


  //packed
  displayedColumnsforPacked: any = ['select', 'orderBy', 'price'];
  selectedRows = new Set<string>(); // Use string for order_Id

  imageFrontUrls = [
    { key: 'Onyx black', value: 'assets/Tees/black-f.png' },
    { key: 'Pearl white', value: 'assets/Tees/white-f.png' },
    { key: 'Sapphire blue', value: 'assets/Tees/blue-f.png' },
    { key: 'Ruby maroon', value: 'assets/Tees/maroon-f.png' },
  ];
  imageBackUrls = [
    { key: 'Onyx black', value: 'assets/Tees/black-b.png' },
    { key: 'Pearl white', value: 'assets/Tees/white-b.png' },
    { key: 'Sapphire blue', value: 'assets/Tees/blue-b.png' },
    { key: 'Ruby maroon', value: 'assets/Tees/maroon-b.png' },
  ];
  // storage
  rowHeaders: string[] = [];
  colHeaders: string[] = ['White', 'Black', 'Maroon', 'Blue'];
  tableData: string[][] = [];

  displayedColumnsforStorage = ['rowHeader', ...this.colHeaders];

  userId: any;

  selectedPrintOptions: { [tshirtId: string]: string[] } = {};
  options: string[] = ['Normal', 'A4', 'A3', 'Poster'];
  cloudflareSharp = environment.cloudflareSharp;

  //coupon
  couponForm: FormGroup;
  couponSubmitted = false;
  constructor(private router: Router, public appservice: AppServiceService, private route: ActivatedRoute, private fb: FormBuilder) {
    this.couponForm = this.fb.group({
      code: ['', Validators.required],
      discountType: ['flat', Validators.required], // 'flat' or 'percent'
      discountValue: [null, [Validators.required, Validators.min(1)]],
      usageLimit: [0, [Validators.required, Validators.min(0)]],
      validFrom: [null],
      validTo: [null],
      isActive: [true]
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    if (this.userId != '123' && this.userId != '456') {
      this.router.navigate(['']);
    }
    this.changeView(this.userId == '123' ? 'pending' : 'printing');
  }

  ngAfterViewInit() {
  }

  //for functionning
  changeView(view: string) {
    if (view != 'storage') {
      this.getOrders(view);
    } else {
      this.getInventory();
    }
    this.currentView = view;
  }

  getOrders(string: any) {
    this.orderData = [];
    this.appservice.getAllOrder({ data: string }).subscribe((response: any) => {
      response.data.map((data: any) => {
        let address =
          data.shippingAddress.building +
          ' ' +
          data.shippingAddress.area +
          ' ' +
          data.shippingAddress.landmark +
          ' ' +
          data.shippingAddress.pincode;
        const input = data.item[0].sku;
        const [code, size, color] = input.split("-", 3);
        let obj = {
          orderBy: data.customer,
          tshirtId: data.item[0].tshirt.tshirtId,
          address: address,
          type: data.payment.method,
          price: data.pricing.total,
          quantity: data.item[0].quantity,
          size: size,
          order_Id: data.order_Id,
          color: color,
          sideName: data.item[0].tshirt.createdByName
        };
        this.orderData.push(obj);
      });
      this.dataSource = new MatTableDataSource<any>(this.orderData);
      for (const row of this.orderData) {
        this.selectedPrintOptions[row.tshirtId] = ['Normal'];
      }
    });
  }

  //for pending
  modalBox() {
    this.showAddElementModal = !this.showAddElementModal;
  }

  onStatusChange(element: any, status: any) {
    const value = this.selectedPrintOptions[element.tshirtId];
    const displayText = value.join(' & ');
    this.appservice.updateOrder({ order_Id: element.order_Id, order_status: status, value: displayText, tshirtId: element.tshirtId }).subscribe((response: any) => {
      if (response.status) {
        const data = this.dataSource.filteredData.filter((item: any) => item.order_Id !== element.order_Id);
        this.dataSource = new MatTableDataSource<any>(data);
      }
    });
  }

  previewTee(element: any) {
    let img: any = [];
    this.appservice.getOnetee({ _id: element.tshirtId }).subscribe((response: any) => {
      if (response.data && response.status) {
        if (response.data.frontImageUrl != "" || response.data.backImageUrl == "") {
          img = this.imageFrontUrls.find(img => img.key === response.data.itemColor);
          response.data.currentSide = img?.value;
          response.data.currentPrint = response.data.frontImageUrl;
        } else {
          img = this.imageBackUrls.find(img => img.key === response.data.itemColor);
          response.data.currentSide = img?.value;
          response.data.currentPrint = response.data.backImageUrl;
        }
      }
      this.previewTeeData = response.data;
    });
  };
  // for packed
  isAllSelected() {
    const numSelected = this.selectedRows.size;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  isIndeterminate() {
    const numSelected = this.selectedRows.size;
    const numRows = this.dataSource.filteredData.length;
    return numSelected > 0 && numSelected < numRows;
  }

  toggleAllSelection(event: any) {
    if (event.checked) {
      this.dataSource.filteredData.forEach((row: any) => this.selectedRows.add(row.order_Id));
    } else {
      this.selectedRows.clear();
    }
  }

  toggleSelection(row: any) {
    if (this.selectedRows.has(row.order_Id)) {
      this.selectedRows.delete(row.order_Id);
    } else {
      this.selectedRows.add(row.order_Id);
    }
  };

  isSelected(row: any) {
    return this.selectedRows.has(row.order_Id);
  }

  getInventory() {
    this.appservice.getInventory().subscribe((response: any) => {
      if (response && response.data.length > 0) {
        const inventory = response.data[0]; // Assuming only one inventory record
        console.log('Inventory:', inventory);
        if (inventory.variants && Array.isArray(inventory.variants)) {
          this.rowHeaders = inventory.variants.map((variant: any) => variant.size);
          this.tableData = inventory.variants.map((variant: any) => [
            variant.stock?.White?.toString() || '0',
            variant.stock?.Black?.toString() || '0',
            variant.stock?.Maroon?.toString() || '0',
            variant.stock?.Blue?.toString() || '0'
          ]);
        }
      }

      console.log('Row Headers:', this.rowHeaders);
      console.log('Table Data:', this.tableData);

    });
  }

  changeSide(element: any) {
    let img;
    if (this.currentSide == 'back') {
      this.currentSide = 'front';
      img = this.imageFrontUrls.find(img => img.key === element.itemColor);
      element.currentSide = img?.value;
      element.currentPrint = element.frontImageUrl;
    } else {
      this.currentSide = 'back';
      img = this.imageBackUrls.find(img => img.key === element.itemColor);
      element.currentSide = img?.value;
      element.currentPrint = element.backImageUrl;
      this.currentSide = 'back';
    }
  }

  submitCoupon() {
    this.couponSubmitted = true;
    if (this.couponForm.invalid) return;

    let couponData = this.couponForm.value;
    couponData.createdBy = '67d57c01135958e9180275f1';
    couponData.assignedToUser = null;
    console.log('Coupon Submitted:', couponData);
    this.appservice.createCoupon(couponData).subscribe({
      next: (response) => {
        if (response.status) {
          window.alert('Coupon created successfully!');
          this.couponForm.reset();
          this.couponSubmitted = false;
          // Optionally, you can navigate to another page or update the UI
        } else {
          window.alert('Failed to create coupon.');
        }
      },
      error: (err) => {
        console.error('Error creating coupon:', err);
        window.alert('An error occurred while creating the coupon.');
      },
      complete: () => {
        console.log('Coupon creation request completed.');
      }
    });
  }

}
