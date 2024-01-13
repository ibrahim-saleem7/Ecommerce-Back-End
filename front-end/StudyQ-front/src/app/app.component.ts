import { Component, OnInit ,ViewChild, ElementRef} from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { StudentService } from './core/service/student/student.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  customers1: any[] = [];

  statuses: any[] = [];

  rowGroupMetadata: any;

  loading: boolean = true;

  @ViewChild('filter') filter!: ElementRef;

  constructor(private customerService: StudentService,) { }

  ngOnInit() {
      this.customerService.getStudents().subscribe({
          next: res => {
              this.customers1 = res.students;
              this.loading = false;
              // this.customers1.forEach(customer => res.date = new Date(customer.date));
              console.log(res.students)
          },
          error: err => console.log(err)
      })
      

          // @ts-ignore
  

      this.statuses = [
          { label: 'Unqualified', value: 'unqualified' },
          { label: 'Qualified', value: 'qualified' },
          { label: 'New', value: 'new' },
          { label: 'Negotiation', value: 'negotiation' },
          { label: 'Renewal', value: 'renewal' },
          { label: 'Proposal', value: 'proposal' }
      ];
  }

  onSort() {
      this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
      this.rowGroupMetadata = {};

      // if (this.customers3) {
      //     for (let i = 0; i < this.customers3.length; i++) {
      //         const rowData = this.customers3[i];
      //         const representativeName = rowData?.representative?.name || '';

      //         if (i === 0) {
      //             this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
      //         }
      //         else {
      //             const previousRowData = this.customers3[i - 1];
      //             const previousRowGroup = previousRowData?.representative?.name;
      //             if (representativeName === previousRowGroup) {
      //                 this.rowGroupMetadata[representativeName].size++;
      //             }
      //             else {
      //                 this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
      //             }
      //         }
      //     }
      // }
  }


  formatCurrency(value: number) {
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
      table.clear();
      this.filter.nativeElement.value = '';
  }
  
  
}
