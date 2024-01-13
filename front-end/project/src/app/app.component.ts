import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Table } from 'primeng/table';
import { ApiService } from './api.service';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  customers!: any[];

    representatives!: any[];

    statuses!: any[];

    loading: boolean = true;

    activityValues: number[] = [0, 100];


  constructor(private apiService : ApiService) { }
  ngOnInit(): void {
    this.getUsers()

    this.representatives = [
      { name: 'Amy Elsner', image: 'amyelsner.png' },
      { name: 'Anna Fali', image: 'annafali.png' },
      { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
      { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
      { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
      { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
      { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
      { name: 'Onyama Limba', image: 'onyamalimba.png' },
      { name: 'Stephen Shaw', image: 'stephenshaw.png' },
      { name: 'Xuxue Feng', image: 'xuxuefeng.png' }
  ];

  this.statuses = [
      { label: 'Unqualified', value: 'unqualified' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'New', value: 'new' },
      { label: 'Negotiation', value: 'negotiation' },
      { label: 'Renewal', value: 'renewal' },
      { label: 'Proposal', value: 'proposal' }
  ];
  }

  getUsers() {
    return this.apiService.getUsers().subscribe((res:any) => {
      this.customers = res.students;
      console.log(res.students)
      this.loading = false;

            this.customers.forEach((customer) => (customer.date = new Date(<Date>customer.date)));
    });
    ;
  }

  clear(table: Table) {
    table.clear();
}

// getSeverity(status: string) {
//     switch (status.toLowerCase()) {
//         case 'unqualified':
//             return 'danger';

//         case 'qualified':
//             return 'success';

//         case 'new':
//             return 'info';

//         case 'negotiation':
//             return 'warning';

//         case 'renewal':
//             return null;
//     }
// }



}
