import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AppServiceService } from '../app-service.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './vendor-dashboard.component.html',
  styleUrl: './vendor-dashboard.component.css'
})
export class VendorDashboardComponent {
  currentView: string = 'pending';

  //pending
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  displayedColumns: any = ['orderBy', 'address', 'type', 'price', 'quantity', 'size', 'status'];
  orderData: any = [];
  dataSource: any = new MatTableDataSource<any>(this.orderData);
  showAddElementModal: boolean = false;
  currentRow: any;
  updatedStatus: any;
  //pending <><><>


  //packed
  displayedColumnsforPacked: any = ['select', 'orderBy', 'price'];
  selectedRows = new Set<string>(); // Use string for order_Id

  constructor(public appservice: AppServiceService) { }

  ngOnInit() {
    this.getOrders('pending');
  }

  ngAfterViewInit() {
  }

  //for functionning
  changeView(view: string) {
    if (view === 'packed') {
      this.getOrders('packed');
    }
    this.currentView = view;
  }

  getOrders(string: any) {
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
      const tripledData = [];
      for (let i = 0; i < 51; i++) {
        tripledData.push(...this.orderData);
      }

      this.dataSource = new MatTableDataSource<any>(this.orderData);
      // this.dataSource.paginator = this.paginator;
      console.log(this.dataSource);
    });
  }

  //for pending
  modalBox() {
    this.showAddElementModal = !this.showAddElementModal;
  }

  onStatusChange(element: any) {
    this.appservice.updateOrder({ order_Id: element.order_Id, order_status: 'packed' }).subscribe((response: any) => {
      console.log(response)
      if (response.status) {
        const data = this.dataSource.filteredData.filter((item: any) => item.order_Id !== element.order_Id);
        this.dataSource = new MatTableDataSource<any>(data);
      }
    });
  }

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


}
