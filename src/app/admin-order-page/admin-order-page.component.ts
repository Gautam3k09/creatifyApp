import { AfterViewInit,Component,ViewChild } from '@angular/core';
import {MatTableModule,MatTableDataSource} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { AppServiceService } from '../app-service.service';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [MatTableModule,MatPaginatorModule],
  providers: [AppServiceService],
  templateUrl: './admin-order-page.component.html',
  styleUrl: './admin-order-page.component.css'
})
export class AdminOrderPageComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  arra : any = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  orderData:any = [];
  dataSource : any = new MatTableDataSource<any>(this.orderData);
 constructor(public appservice : AppServiceService){}

  ngOnInit(){
    this.appservice.getAllOrder().subscribe((response: any) => {
      // this.arra = data;
      // this.dataSource.data = this.arra;
      console.log(response,'response');
      response.data.map((data: any) => {
        let address = data.order_address[0].building + ' ' + data.order_address[0].area + ' ' + data.order_address[0].landmark + ' ' + data.order_address[0].city + ' ' + data.order_address[0].pincode;
        let obj = {
          orderBy: data.orderBys,
          tshirtId : data.order_tshirtId,
          orderStatus : data.order_status,
          address : address
        }
        this.orderData.push(obj);
      })
      this.dataSource = new MatTableDataSource<any>(this.orderData);
      console.log(this.dataSource )
    });
    // this.dataSource.sort = this.appservice.sort;
    // this.dataSource.filterPredicate = this.appservice.filterPredicate;

  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<any>(this.orderData);
    this.dataSource.paginator = this.paginator;
  }
}
