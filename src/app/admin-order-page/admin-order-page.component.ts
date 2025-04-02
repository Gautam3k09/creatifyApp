import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AppServiceService } from '../app-service.service';

@Component({
    selector: 'app-order-page',
    standalone: true,
    imports: [MatTableModule, MatPaginatorModule],
    providers: [AppServiceService],
    templateUrl: './admin-order-page.component.html',
    styleUrl: './admin-order-page.component.css',
})
export class AdminOrderPageComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
    displayedColumns: any = ['orderBy', 'address', 'type', 'price', 'quantity', 'size'];
    orderData: any = [];
    dataSource: any = new MatTableDataSource<any>(this.orderData);
    showAddElementModal: boolean = false;
    currentRow: any;
    constructor(public appservice: AppServiceService) { }

    ngOnInit() {
        this.appservice.getAllOrder().subscribe((response: any) => {
            response.data.map((data: any) => {
                let address =
                    data.order_address[0].building +
                    ' ' +
                    data.order_address[0].area +
                    ' ' +
                    data.order_address[0].landmark +
                    ' ' +
                    data.order_address[0].city +
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
                };
                this.orderData.push(obj);
            });
            this.dataSource = new MatTableDataSource<any>(this.orderData);
            console.log(this.dataSource);
        });
        // this.dataSource.sort = this.appservice.sort;
        // this.dataSource.filterPredicate = this.appservice.filterPredicate;
    }

    ngAfterViewInit() {
        this.dataSource = new MatTableDataSource<any>(this.orderData);
        this.dataSource.paginator = this.paginator;
    }

    modalBox() {
        this.showAddElementModal = !this.showAddElementModal;
    }
}
