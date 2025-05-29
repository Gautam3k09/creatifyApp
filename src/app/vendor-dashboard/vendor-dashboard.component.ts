import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AppServiceService } from '../app-service.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environment';


@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSelectModule, MatCheckboxModule, FormsModule],
  templateUrl: './vendor-dashboard.component.html',
  styleUrl: './vendor-dashboard.component.css'
})
export class VendorDashboardComponent {
  currentView: string = 'storage';

  //pending
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  displayedColumns: any = ['orderBy', 'address', 'type', 'price', 'quantity', 'size', 'status', 'preview'];
  displayedColumnsforprinting: any = ['orderBy', 'quantity', 'size', 'status', 'preview', 'print'];
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

  selectedPrintOptions: { [id: number]: string } = {};
  options: string[] = ['Normal', 'A4', 'A3'];
  cloudflareSharp = environment.cloudflareSharp;
  constructor(private router: Router, public appservice: AppServiceService, private route: ActivatedRoute) { }

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
          data.order_address[0].building +
          ' ' +
          data.order_address[0].area +
          ' ' +
          data.order_address[0].landmark +
          ' ' +
          data.order_address[0].pincode;
        let obj = {
          orderBy: data.orderBys,
          tshirtId: data.order_tshirtId,
          address: address,
          type: data.order_payment,
          price: data.order_price,
          quantity: data.order_quantity,
          size: data.order_size,
          order_Id: data.order_Id
        };
        this.orderData.push(obj);
      });
      this.dataSource = new MatTableDataSource<any>(this.orderData);
      for (const row of this.orderData) {
        this.selectedPrintOptions[row.tshirtId] = 'Normal';
      }
      console.log(this.dataSource);
    });
  }

  //for pending
  modalBox() {
    this.showAddElementModal = !this.showAddElementModal;
  }

  onStatusChange(element: any, status: any) {
    const value = this.selectedPrintOptions[element.tshirtId];
    this.appservice.updateOrder({ order_Id: element.order_Id, order_status: status, value: value, tshirtId: element.tshirtId }).subscribe((response: any) => {
      console.log(response)
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

}
